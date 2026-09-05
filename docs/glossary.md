# Healthcare Interoperability Glossary

These definitions describe the terms used in the Hospital Interoperability Hub. System responsibilities reflect this project's simplified architecture; responsibilities may differ in real hospital implementations.

## Acknowledgement (ACK)

A response sent by a receiving system to the sender to indicate whether a message was accepted or rejected. A positive ACK confirms message acceptance, not necessarily completion of the requested clinical or business process. No ACK means the delivery outcome is unknown.

## Billing System

A system that records charges for services provided to a patient and prepares the hospital bill. It may also provide billing information to an insurance or claims-processing system.

## Computerized Provider Order Entry (CPOE)

A system or EHR module in which authorized clinicians create and track orders for services such as laboratory testing, imaging, and medication. In this project, it owns the originating order record and receives status updates and results from the fulfilling system.

## Dispensing

The pharmacy process of preparing and issuing an approved medication quantity to a patient or care area. A dispensing record does not prove that the medication was administered to or taken by the patient.

## Electronic Health Record (EHR)

A system that stores clinical documentation about a patient's care. In this project, it owns physician notes, examination findings, and the physician's discharge authorization.

## Encounter

A distinct episode of care, such as an outpatient visit, emergency visit, or inpatient admission. It has its own identifier and status while remaining linked to the same patient identifier.

## Health Information Exchange (HIE)

The electronic sharing of health information between different healthcare organizations. Standards such as HL7 and FHIR can support this exchange.

## Hospital Information System / Patient Administration System (HIS/PAS)

A system that manages patient registration and administrative encounters. In this project, it owns the local patient identifier, encounter identifier, and authoritative encounter status, and it notifies downstream systems when encounters open or close.

## Idempotency

The property that processing the same request or event identifier more than once produces the same business outcome without duplicating the action or side effect.

## Insurance or Claims-Processing System

A system that manages claims submitted to an insurance provider and tracks their processing, approval, rejection, or denial status.

## Inventory System

A system that manages stock balances and movement records. In this project, it owns the authoritative current stock, processes medication deductions, and returns the stock before, stock after, and applied quantity to the requesting pharmacy system.

## Laboratory Information System (LIS)

A system that manages laboratory workflows, including specimen collection and processing status, testing, and laboratory reports and results. It receives laboratory orders from CPOE and returns status updates and results.

## Medication Administration

The actual act of giving a medication to, or recording its intake by, the patient. Administration is separate from prescribing, pharmacist verification, and dispensing.

## Minimum Necessary Access

A privacy and security principle that limits a person's or system's access to only the information and permissions required to perform an authorized function.

## Master Patient Index (MPI)

A patient-matching database that links identifiers believed to belong to the same person across systems or organizations. It reduces duplicate patient records but cannot guarantee perfect matching.

## Medical Record Number (MRN)

A patient identifier assigned by a hospital or healthcare organization for use within that organization's records. It is not necessarily a universal identifier across organizations.

## Order

A formal request for a clinical or operational service, such as a laboratory test, imaging study, or medication. The originating system tracks the order, while the receiving system owns the records produced while fulfilling it.

## Picture Archiving and Communication System (PACS)

A system used to store, retrieve, manage, and distribute medical images such as radiographs, CT scans, and MRI studies.

## Pharmacy Management System (PMS)

A system that manages pharmacy operations. In this project, it records pharmacist verification and medication dispensing and sends movement requests to the Inventory system after dispensing.

## Prescription

A medication order created by an authorized prescriber. It identifies the patient and medication and normally includes the dose, concentration or strength, route, frequency, duration, and order identifier.

## Result

The clinical output produced when an order is fulfilled, such as a laboratory report, observation, radiology report, or reference to an image. The fulfilling departmental system owns its authoritative result.

## Radiology Information System (RIS)

A system that manages radiology operations, including scheduling, worklists, order tracking, and radiology reporting. PACS normally manages the medical images themselves.

## Source of Truth (SoT)

The system with authoritative responsibility for maintaining a particular record or fact. When systems display different values, the value held by the designated source of truth is considered authoritative for reconciliation.

## Terminology Service

A service that validates, maps, and provides standardized clinical and administrative codes, such as codes for laboratory tests, diagnoses, medications, and procedures.

## Verification

A pharmacist's review of a prescription for clinical and operational appropriateness. Verification may approve, reject, or request clarification of the prescription and can authorize the dispensing workflow, but it does not mean the medication was dispensed or administered.
