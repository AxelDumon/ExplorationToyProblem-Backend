import fs from "node:fs";
import { SimulationProps } from "./types";

interface SimulationManagerProps {
  simulations: SimulationProps[]; // All the simulations
}

export class SimulationManager {
  static RESULTS_FOLDER: fs.PathOrFileDescriptor = "/app/results.json";
  // static WRITE_OPTIONS = { flag: "a", mode: "644" };

  static addExperience(
    result: SimulationProps,
    path: fs.PathOrFileDescriptor = SimulationManager.RESULTS_FOLDER
  ) {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      let simulationsManager: SimulationManagerProps;

      if (data) {
        simulationsManager = JSON.parse(data) as SimulationManagerProps;
        simulationsManager.simulations.push({
          ...result,
          simulationNumberID: simulationsManager.simulations.length,
        });
      } else {
        simulationsManager = {
          simulations: [{ ...result, simulationNumberID: 0 }],
        };
      }

      fs.writeFile(path, JSON.stringify(simulationsManager), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`file written successfully at ${path}`);
        }
      });
    });
  }
}
