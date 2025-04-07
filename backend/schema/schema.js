// backend/schema/schema.js
const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    spaceid: {
      id: { type: Number, required: true },
    },
    monitoring: {
      webURL: { type: String, required: true },
      isValidURL: { type: Boolean, required: true },
      multipleURLs: { type: Boolean, default: false },
      monitorType: {
        type: String,
        enum: ["http", "api", "keyword", "dns", "ssl", "port"],
        required: true,
      },
      geographicLocations: [{ type: String }],
      customHeaders: { type: Object },
      port: { type: Number },
    },
    alertConditions: {
      alertCondition: { type: String, required: true },
      customConditions: { type: Boolean, default: false },
      errorRateThreshold: { type: Number },
      timeoutDuration: { type: Number },
      keyword: { type: String },
      httpStatusCode: { type: Number },
      severityLevel: {
        type: String,
        enum: ["warning", "critical"],
        required: true,
      },
    },
    alerts: {
      notificationMethods: [{ type: String }],
      escalationOption: { type: String, required: true },
      escalationDelay: { type: String },
      webhookURL: { type: String },
      slackChannel: { type: String },
      trackitChannel: { type: String },
    },
    advancedSettings: {
      confirmationTime: { type: String, default: "now" },
      recoveryTime: { type: String, default: "3m" },
      checkFrequency: { type: String, default: "3m" },
      monitorTags: [{ type: String }],
      maintenanceWindow: {
        start: { type: Date },
        end: { type: Date },
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    database: "monitors",
    collection: "monitors", 
    timestamps: true,
  }
);

// Add indexes for performance
monitorSchema.index({ "monitoring.webURL": 1 });
monitorSchema.index({ "monitoring.monitorType": 1 });
monitorSchema.index({ createdAt: 1 });

module.exports = monitorSchema;