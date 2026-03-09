import React from "react";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { useSettings } from "../../hooks/useSettings";

interface PostProcessingToggleProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const PostProcessingToggle: React.FC<PostProcessingToggleProps> =
  React.memo(({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();

    const enabled = getSetting("post_process_enabled") || false;
    const actions = getSetting("post_process_actions") || [];
    const defaultActionKey = getSetting("default_post_process_action_key");

    const handleChipClick = (key: number) => {
      // Toggle: if already selected, deselect; otherwise select
      const newValue = defaultActionKey === key ? null : key;
      updateSetting("default_post_process_action_key", newValue);
    };

    return (
      <div
        className={`space-y-4 ${
          grouped ? "p-4 bg-base-200/50 rounded-box border border-base-300" : ""
        }`}
      >
        <ToggleSwitch
          checked={enabled}
          onChange={(enabled) => updateSetting("post_process_enabled", enabled)}
          isUpdating={isUpdating("post_process_enabled")}
          label={t("settings.debug.postProcessingToggle.label")}
          description={t("settings.debug.postProcessingToggle.description")}
          descriptionMode={descriptionMode}
          grouped={false}
        />

        {enabled && (
          <div
            className="pl-4 ml-2 border-l-2 border-logo-primary/30 overflow-hidden"
            style={{
              animation: "slideDown 200ms ease-out forwards",
            }}
          >
            <p className="text-xs font-medium text-mid-gray mb-2.5 uppercase tracking-wide">
              {t("settings.postProcessing.actions.defaultActionLabel", {
                defaultValue: "Default action (optional)",
              })}
            </p>

            {actions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {/* "None" chip */}
                <button
                  type="button"
                  onClick={() =>
                    updateSetting("default_post_process_action_key", null)
                  }
                  disabled={isUpdating("default_post_process_action_key")}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-200 cursor-pointer select-none
                    border
                    ${
                      defaultActionKey == null
                        ? "bg-mid-gray/15 border-mid-gray/40 text-text shadow-sm"
                        : "bg-transparent border-mid-gray/15 text-mid-gray hover:bg-mid-gray/10 hover:border-mid-gray/30"
                    }
                  `}
                >
                  {t("settings.postProcessing.actions.noDefaultAction", {
                    defaultValue: "No default action",
                  })}
                </button>

                {/* Action chips */}
                {[...actions]
                  .sort((a, b) => a.key - b.key)
                  .map((action) => {
                    const isSelected = defaultActionKey === action.key;
                    return (
                      <button
                        key={action.key}
                        type="button"
                        onClick={() => handleChipClick(action.key)}
                        disabled={isUpdating("default_post_process_action_key")}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                          transition-all duration-200 cursor-pointer select-none
                          border
                          ${
                            isSelected
                              ? "bg-logo-primary/15 border-logo-primary/50 text-logo-primary shadow-sm"
                              : "bg-transparent border-mid-gray/15 text-text hover:bg-logo-primary/8 hover:border-logo-primary/30"
                          }
                        `}
                      >
                        {/* Key badge */}
                        <span
                          className={`
                            inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold font-mono
                            ${
                              isSelected
                                ? "bg-logo-primary/25 text-logo-primary"
                                : "bg-mid-gray/12 text-mid-gray"
                            }
                          `}
                        >
                          {action.key}
                        </span>
                        <span className="truncate max-w-[120px]">
                          {action.name}
                        </span>
                        {/* Star indicator for selected */}
                        {isSelected && (
                          <span className="text-logo-primary text-[10px] ml-0.5">
                            {t(
                              "settings.postProcessing.actions.selectedIndicator",
                              {
                                defaultValue: "★",
                              },
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-mid-gray/5 border border-dashed border-mid-gray/20">
                <svg
                  className="w-4 h-4 text-mid-gray/50 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-xs text-mid-gray">
                  {t("settings.postProcessing.actions.createFirst", {
                    defaultValue:
                      "Create actions in the Post-Processing tab to select a default.",
                  })}
                </p>
              </div>
            )}

            {isUpdating("default_post_process_action_key") && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-3.5 h-3.5 border-2 border-logo-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-mid-gray">
                  {t("common.saving", { defaultValue: "Saving..." })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  });
