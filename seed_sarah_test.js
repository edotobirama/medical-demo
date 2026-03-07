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
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sarahUser, deletedAppointments, deletedProfiles, deletedUsers, passwordHash, today, currentApptTime, i, patientName, patientEmail, newUser, requestedTimeStr, actualStartTimeStr, endTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting to seed 30 test patients and appointments for Sarah Wilson...');
                    return [4 /*yield*/, prisma.user.findFirst({
                            where: {
                                name: {
                                    contains: 'Sarah Wilson',
                                    mode: 'insensitive' // Optional, but good for robust searching
                                },
                                role: 'DOCTOR'
                            },
                            include: {
                                doctorProfile: true
                            }
                        })];
                case 1:
                    sarahUser = _a.sent();
                    if (!sarahUser || !sarahUser.doctorProfile) {
                        console.error('CRITICAL ERROR: Could not find Dr. Sarah Wilson in the database.');
                        process.exit(1);
                    }
                    console.log("Found Dr. Sarah Wilson (Doctor Profile ID: ".concat(sarahUser.doctorProfile.id, ")"));
                    // 2. Clear previous test patients if they exist (cleanup strategy based on user prompt request)
                    console.log('Cleaning up old test patients if any...');
                    return [4 /*yield*/, prisma.appointment.deleteMany({
                            where: {
                                patient: {
                                    user: {
                                        email: { startsWith: 'testpatient_sarah_' }
                                    }
                                }
                            }
                        })];
                case 2:
                    deletedAppointments = _a.sent();
                    return [4 /*yield*/, prisma.patientProfile.deleteMany({
                            where: {
                                user: {
                                    email: { startsWith: 'testpatient_sarah_' }
                                }
                            }
                        })];
                case 3:
                    deletedProfiles = _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany({
                            where: {
                                email: { startsWith: 'testpatient_sarah_' }
                            }
                        })];
                case 4:
                    deletedUsers = _a.sent();
                    console.log("Cleaned up: ".concat(deletedAppointments.count, " appointments, ").concat(deletedProfiles.count, " profiles, ").concat(deletedUsers.count, " users."));
                    return [4 /*yield*/, bcryptjs_1.default.hash('password123', 10)];
                case 5:
                    passwordHash = _a.sent();
                    today = new Date();
                    today.setHours(0, 0, 0, 0); // Start of today
                    currentApptTime = new Date(today);
                    currentApptTime.setHours(9, 0, 0, 0); // Start at 9:00 AM today
                    i = 1;
                    _a.label = 6;
                case 6:
                    if (!(i <= 30)) return [3 /*break*/, 10];
                    patientName = "Test Patient ".concat(i);
                    patientEmail = "testpatient_sarah_".concat(i, "@example.com");
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: patientName,
                                email: patientEmail,
                                password: passwordHash,
                                role: 'PATIENT',
                                patientProfile: {
                                    create: {
                                        // Add some basic profile info if needed
                                        bloodGroup: 'O+',
                                        gender: i % 2 === 0 ? 'Female' : 'Male'
                                    }
                                }
                            },
                            include: {
                                patientProfile: true
                            }
                        })];
                case 7:
                    newUser = _a.sent();
                    requestedTimeStr = new Date(currentApptTime);
                    actualStartTimeStr = new Date(currentApptTime);
                    endTime = new Date(currentApptTime);
                    endTime.setMinutes(endTime.getMinutes() + 15); // 15 min duration
                    // Create Appointment
                    return [4 /*yield*/, prisma.appointment.create({
                            data: {
                                patientId: newUser.patientProfile.id,
                                doctorId: sarahUser.doctorProfile.id,
                                requestedTime: requestedTimeStr,
                                actualStartTime: actualStartTimeStr,
                                actualEndTime: endTime,
                                estimatedDuration: 15, // 15 minutes
                                amountPaid: 50.0, // dummy amount
                                totalCost: 150.0,
                                status: 'BOOKED',
                                type: 'OFFLINE',
                                issueDescription: "Test Booking for Patient ".concat(i),
                                bookingNumber: i + 1000, // Just a dummy sequential number, assuming 1000 is safe
                            }
                        })];
                case 8:
                    // Create Appointment
                    _a.sent();
                    console.log("Created Patient ".concat(i, ": ").concat(patientEmail, " - Appt at ").concat(requestedTimeStr.toLocaleTimeString()));
                    // Increment time for next patient (15 mins)
                    currentApptTime.setMinutes(currentApptTime.getMinutes() + 15);
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 6];
                case 10:
                    console.log('\n✅ Successfully seeded 30 test patients and appointments for Sarah Wilson for today.');
                    console.log('You can delete these later by running a script that deletes users where email starts with "testpatient_sarah_"');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
