import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.js";

let isCloudinaryConfigured = false;

const ensureCloudinaryConfigured = () => {
    if (isCloudinaryConfigured) {
        return;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (cloudName && apiKey && apiSecret) {
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        });
        isCloudinaryConfigured = true;
        return;
    }

    if (cloudinaryUrl) {
        try {
            const parsed = new URL(cloudinaryUrl);
            const parsedKey = parsed.username;
            const parsedSecret = parsed.password;
            const parsedCloudName = parsed.hostname;

            if (!parsedCloudName || !parsedKey || !parsedSecret) {
                throw new Error("Invalid CLOUDINARY_URL format");
            }

            cloudinary.config({
                cloud_name: parsedCloudName,
                api_key: parsedKey,
                api_secret: parsedSecret,
                secure: true
            });
            isCloudinaryConfigured = true;
            return;
        } catch (error) {
            throw new ApiError(500, "Invalid CLOUDINARY_URL configuration");
        }
    }

    throw new ApiError(500, "Cloudinary environment variables are not configured");

};

const normalizeUploadResult = (result) => ({
    url: result.secure_url || result.url,
    public_id: result.public_id
});

const uploadBufferToCloudinary = async (fileBuffer, options = {}) => {
    if (!fileBuffer) {
        throw new ApiError(400, "Image buffer is required for upload");
    }
    ensureCloudinaryConfigured();

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: process.env.CLOUDINARY_FOLDER || "wanderpath",
                ...options
            },
            (error, result) => {
                if (error) {
                    return reject(new ApiError(502, `Cloudinary upload failed: ${error.message}`));
                }

                if (!result?.public_id || !(result.secure_url || result.url)) {
                    return reject(new ApiError(502, "Cloudinary upload returned an invalid response"));
                }

                resolve(normalizeUploadResult(result));
            }
        );

        stream.end(fileBuffer);
    });
};

const uploadManyToCloudinary = async (files = [], options = {}) => {
    if (!Array.isArray(files) || files.length === 0) {
        return [];
    }

    const uploads = [];

    try {
        for (const file of files) {
            const uploaded = await uploadBufferToCloudinary(file.buffer, options);
            uploads.push(uploaded);
        }

        return uploads;
    } catch (error) {
        await deleteManyFromCloudinary(uploads.map((file) => file.public_id));
        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) {
        return null;
    }
    ensureCloudinaryConfigured();

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    if (result.result !== "ok" && result.result !== "not found") {
        throw new ApiError(502, "Failed to delete image from Cloudinary");
    }

    return result;
};

const deleteManyFromCloudinary = async (publicIds = []) => {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
        return;
    }

    await Promise.all(
        publicIds.filter(Boolean).map((publicId) => deleteFromCloudinary(publicId))
    );
};

export {
    uploadBufferToCloudinary,
    uploadManyToCloudinary,
    deleteFromCloudinary,
    deleteManyFromCloudinary
};
