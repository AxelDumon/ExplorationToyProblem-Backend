import fs from "node:fs";
import { SimulationProps } from "./types";

interface SimulationManagerProps {
  simulations: SimulationProps[]; // All the simulations
}

export class SimulationManager {
  static RESULTS_FOLDER: fs.PathLike = "/tmp/exploration-grid-results.json";
  // static WRITE_OPTIONS = { flag: "a", mode: "644" };

  static addExperience(
    result: SimulationProps,
    path: fs.PathLike = SimulationManager.RESULTS_FOLDER
  ) {
    // Check if the file exists
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, create it with an empty simulations array
        const initialData: SimulationManagerProps = { simulations: [] };

        fs.writeFile(path, JSON.stringify(initialData), (writeErr) => {
          if (writeErr) {
            console.error(`Error creating file: ${writeErr}`);
          } else {
            console.log(`File created successfully at ${path}`);
          }
        });

        return;
      }
    });

    // File exists, proceed to read and update it
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
