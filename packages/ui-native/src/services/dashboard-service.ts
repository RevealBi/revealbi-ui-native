import { RdashDocument } from "@revealbi/dom";
import { RevealSdkClient } from "../RevealSdkClient";

export class DashboardService {
    static async getById(id: string): Promise<RdashDocument> {
        try {
            const response = await fetch(`${RevealSdkClient.instance.baseUrl}/DashboardFile/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch dashboard ${id}`);
            }
            const result = await response.json();
            return RdashDocument.loadFromJson(result["model"]);

        } catch (error: any) {
            console.error("Error fetching dashboard:", error);
            throw new Error(`Error fetching dashboard ${id}: ${error.message}`);
        }
    }
}