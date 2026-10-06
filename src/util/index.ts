import { PermissionsAndroid, Platform } from "react-native";
import { CONTENT_TYPE_FORMDATA, CONTENT_TYPE_JSON, GET_REQUEST } from "../configs";
import { store } from "../store";

const intl = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
});

export const isEmptyString = (str: any): boolean => {
    if (typeof str === "string") {
        const regx = /^\s*$/;
        return regx.test(str);
    } else {
        return true;
    }
};

export const isNull = (value: any): boolean => {
    return value === null || value === "null";
};

export const debounce = (func: Function, timeout = 300) => {
    let timer: any;
    return (...args: any) => {
        if (typeof timer !== "undefined") {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
};

export const toUpperCaseWord = (str: string) => {
    str = str.toLowerCase();
    const words = str.trim().split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
    }
    return words.join(" ");
};

/**
 * @Desc: Masked an aadhaar no.
 */
export const getMaskedAadhaarNumber = (aadhaarNo: number) => {
    let maskAadhaarNo: string = `${aadhaarNo}`;
    maskAadhaarNo =
        maskAadhaarNo.slice(0, 8).replace(/\d/g, "X") + maskAadhaarNo.slice(-4);
    return maskAadhaarNo;
};

/**
 * @Desc: Get file data
 */
export const getFileData = (data: any) => {
    let path: string =
        Platform.OS === "ios" ? data.path.replace("file://", "") : data.path;
    let arr = (path || "").split("/");
    let fileName: string = (arr[arr.length - 1] || "").trim();

    return {
        name: fileName,
        type: data.mime,
        uri: path,
    };
};

/**
 * @Desc: Request location permission from user
 */
export const requestLocationPermission = async (
    callback: (value: boolean) => void
) => {
    try {
        const isGranted: boolean = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (isGranted) {
            callback(true);
        } else {
            const reqStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            callback(reqStatus === PermissionsAndroid.RESULTS.GRANTED);
        }
    } catch (error) {
        callback(false);
    }
};

/**
 * @Desc: Request storage permission from user
 */
export const requestStoragePermission = async (
    callback: (value: boolean) => void
) => {
    try {
        if (Number(Platform.Version) >= 30) {
            callback(true);
        } else {
            const isGranted: boolean = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (isGranted) {
                callback(true);
            } else {
                const reqStatus = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                callback(reqStatus === PermissionsAndroid.RESULTS.GRANTED);
            }
        }
    } catch (error) {
        callback(false);
    }
};

export const getAxoisRequestHeaders = (
    reqMethod = GET_REQUEST,
    isFormData = false
) => {
    const state = store.getState();
    // FIXED: Updated to match EvanooFinance auth slice structure
    const token = state.auth.accessToken;
    const headers: { Authorization: string; "Content-Type"?: string } = {
        Authorization: `Bearer `,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (reqMethod !== GET_REQUEST) {
        headers["Content-Type"] = isFormData
            ? CONTENT_TYPE_FORMDATA
            : CONTENT_TYPE_JSON;
    }

    return headers;
}

export const getAvtarText = (name: string) => {
    const arr: Array<string> = name.split(" ");
    if (arr.length === 1) {
        return arr[0].substring(0, 2).toUpperCase();
    }
    const str: string = `${arr[0].charAt(0)}${arr[arr.length - 1].charAt(0)}`;
    return str.toUpperCase();
};
