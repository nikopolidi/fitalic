const { withEntitlementsPlist } = require("@expo/config-plugins");

module.exports = function withAppGroupEntitlements(config) {
  return withEntitlementsPlist(config, (mod) => {
    mod.modResults["com.apple.security.application-groups"] = [
      "group.com.vitalii.nikopolidi.fitalic.shared"
    ];
    return mod;
  });
}; 