import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    let token = localStorage.getItem('hdbsv2Token') ?? '';
    let deviceToken = localStorage.getItem('hdbsv2DeviceToken') ?? '';

    request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            'DeskSyncv2-Device-Token': deviceToken
        }
    })
    return next(request)
}