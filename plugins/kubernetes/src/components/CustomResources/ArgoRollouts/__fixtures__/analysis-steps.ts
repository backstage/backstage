import {AnalysisStep} from "../types";

export const steps: AnalysisStep[] = [
  {
    "analysis": {
      "templates": [
        {
          "templateName": "always-pass"
        },
        {
          "templateName": "always-fail"
        }
      ]
    }
  },
  {
    "analysis": {
      "templates": [
        {
          "templateName": "req-rate",
          "clusterScope": true
        },
      ]
    }
  }
]

export default steps;
