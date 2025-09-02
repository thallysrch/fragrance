type VisionResult = {
    brand?: string;
    name?: string;
    confidence?: number;
};
export declare function identifyPerfumeFromImage(file: Express.Multer.File): Promise<VisionResult>;
export {};
//# sourceMappingURL=vision.d.ts.map