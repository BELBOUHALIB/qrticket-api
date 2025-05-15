"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTicketPDF = void 0;
var jspdf_1 = require("jspdf");
var qrcode_1 = require("qrcode");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var generateTicketPDF = function (ticket) { return __awaiter(void 0, void 0, void 0, function () {
    var doc_1, margin_1, pageWidth, contentWidth_1, yPosition_1, logoWidth, logoHeight, eventNameLines, details, validationUrl, qrCodeDataUrl, qrCodeSize, qrCodeX, legalNotes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                doc_1 = new jspdf_1.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                doc_1.setFont('helvetica');
                margin_1 = 20;
                pageWidth = doc_1.internal.pageSize.width;
                contentWidth_1 = pageWidth - (margin_1 * 2);
                yPosition_1 = margin_1;
                if (ticket.logo) {
                    try {
                        logoWidth = 40;
                        logoHeight = 20;
                        doc_1.addImage(ticket.logo, 'PNG', margin_1, yPosition_1, logoWidth, logoHeight, undefined, 'FAST');
                        doc_1.setFontSize(24);
                        doc_1.setTextColor(79, 70, 229);
                        doc_1.text('QRticketPro', margin_1 + logoWidth + 5, yPosition_1 + (logoHeight / 2));
                        yPosition_1 += logoHeight + 10;
                    }
                    catch (error) {
                        console.warn('Impossible de charger le logo:', error);
                        doc_1.setFontSize(24);
                        doc_1.setTextColor(79, 70, 229);
                        doc_1.text('QRticketPro', margin_1, yPosition_1 + 10);
                        yPosition_1 += 20;
                    }
                }
                else {
                    doc_1.setFontSize(24);
                    doc_1.setTextColor(79, 70, 229);
                    doc_1.text('QRticketPro', margin_1, yPosition_1 + 10);
                    yPosition_1 += 20;
                }
                doc_1.setTextColor(0, 0, 0);
                doc_1.setFontSize(20);
                eventNameLines = doc_1.splitTextToSize(ticket.eventName, contentWidth_1);
                doc_1.text(eventNameLines, margin_1, yPosition_1 + 10);
                yPosition_1 += 10 * eventNameLines.length + 10;
                doc_1.setFontSize(12);
                details = [
                    "Date : ".concat((0, date_fns_1.format)(ticket.eventDate, 'dd MMMM yyyy', { locale: locale_1.fr })),
                    "Lieu : ".concat(ticket.location),
                    "Type de billet : ".concat(ticket.ticketType),
                    "Prix : ".concat(ticket.price, " MAD")
                ];
                details.forEach(function (detail) {
                    doc_1.text(detail, margin_1, yPosition_1);
                    yPosition_1 += 8;
                });
                validationUrl = "https://www.qrticketpro.com/validate.php?id=".concat(ticket.id);
                return [4 /*yield*/, qrcode_1.default.toDataURL(validationUrl, {
                        errorCorrectionLevel: 'H',
                        margin: 1,
                        width: 300
                    })];
            case 1:
                qrCodeDataUrl = _a.sent();
                qrCodeSize = 50;
                qrCodeX = (pageWidth - qrCodeSize) / 2;
                yPosition_1 += 10;
                doc_1.addImage(qrCodeDataUrl, 'PNG', qrCodeX, yPosition_1, qrCodeSize, qrCodeSize);
                yPosition_1 += qrCodeSize + 10;
                doc_1.setFontSize(10);
                doc_1.text("Ticket ID: ".concat(ticket.id), margin_1, yPosition_1);
                yPosition_1 += 10;
                doc_1.setFontSize(8);
                legalNotes = [
                    'Ce billet est personnel et non cessible. Une pièce d\'identité pourra être demandée.',
                    'Le code QR doit être présenté à l\'entrée de l\'événement pour validation.'
                ];
                legalNotes.forEach(function (note) {
                    var noteLines = doc_1.splitTextToSize(note, contentWidth_1);
                    doc_1.text(noteLines, margin_1, yPosition_1);
                    yPosition_1 += 5 * noteLines.length;
                });
                return [2 /*return*/, doc_1];
            case 2:
                error_1 = _a.sent();
                console.error('Erreur lors de la génération du PDF:', error_1);
                throw new Error('Erreur lors de la génération du PDF. Veuillez réessayer.');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.generateTicketPDF = generateTicketPDF;
