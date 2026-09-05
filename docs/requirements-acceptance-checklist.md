# Requirements and Acceptance Checklist

This checklist defines observable and testable expectations for the Hospital Interoperability Hub's synthetic patient journey.

## Registration and Encounter Creation

### User need

- The registration clerk needs to identify or register the patient and open a new encounter.

### Expected event, data, and owner

- HIS/PAS searches for an existing patient using the supplied demographic identifiers before creating a new patient record.
- If no matching patient exists, HIS/PAS creates and owns patient record PAT-1001.
- HIS/PAS creates and owns encounter ENC-2001 with status OPEN, linked to PAT-1001.
- Required data include patient demographics, clerk ID, admission timestamp, encounter type, and location.
- HIS/PAS sends the patient and encounter notification to each required downstream system.

### Success conditions

- Exactly one PAT-1001 is resolved or created.
- Exactly one ENC-2001 is created with status OPEN and linked to PAT-1001.
- Each required downstream system accepts the notification and returns a positive acknowledgement.

### Failure conditions

- Patient identity cannot be resolved because required identifiers are missing or conflicting.
- ENC-2001 cannot be created or linked to PAT-1001.
- A downstream system rejects the notification or returns no acknowledgement.

### Recovery conditions

- Correct invalid or missing registration data before resubmission.
- Retry with the same patient and encounter identities after checking whether PAT-1001 or ENC-2001 already exists.
- A failed downstream notification does not undo the completed registration or encounter creation.
- Retry the same notification only to the failed destination.

## Examination Documentation

### User need

- The physician needs to document examination findings, assessment, and recommendations for the correct patient encounter.

### Expected event, data, and owner

- EHR creates examination note EXAM-2001 linked to PAT-1001 and ENC-2001.
- Required data include physician ID, findings, assessment or initial diagnosis, recommendations, and examination timestamp.
- EHR owns EXAM-2001 and the clinical content recorded in it.

### Success conditions

- EHR validates PAT-1001 and confirms that ENC-2001 is the intended open encounter.
- EXAM-2001 is stored once with the physician identity and timestamp.
- The saved note can be retrieved from the correct patient encounter.

### Failure conditions

- PAT-1001 or ENC-2001 cannot be found or does not match.
- Required note data are missing or invalid.
- The save result is unsuccessful or unknown.

### Recovery conditions

- Correct missing or invalid data before resubmission.
- Check whether EXAM-2001 was already stored before retrying an uncertain save.
- Retry using the same EXAM-2001 identity so the EHR does not create a duplicate note.

## CBC Ordering

### User need

- The physician needs to order a CBC for PAT-1001 during ENC-2001.

### Expected event, data, and owner

- CPOE creates and owns laboratory order LAB-3001.
- Required data include PAT-1001, ENC-2001, CBC test identifier, urgency, ordering physician ID, order status, and submission timestamp.
- CPOE sends LAB-3001 to LIS.
- LIS stores a local order copy and owns its local receipt and processing statuses.

### Success conditions

- CPOE stores LAB-3001 once and sends the complete order to LIS.
- LIS validates LAB-3001, records its local status as ACCEPTED, and returns a positive application acknowledgement.
- The acknowledgement confirms order acceptance; it does not mean specimen collection or testing is complete.

### Failure conditions

- The order contains missing or invalid required data, and LIS rejects it.
- CPOE receives a negative acknowledgement.
- CPOE receives no acknowledgement, so the delivery outcome is unknown.

### Recovery conditions

- Correct rejected data and resubmit LAB-3001 according to the agreed correction process.
- After a timeout, CPOE retransmits the same LAB-3001 identity.
- If LIS already accepted LAB-3001, it returns the existing accepted status without creating another order.
- If LIS has not accepted LAB-3001, it validates and stores it once before returning the result.

## Specimen Processing and Report Delivery

### User need

- The laboratory technician needs to collect and process a specimen and release the completed CBC report to the physician.

### Expected event, data, and owner

- LIS creates and owns specimen record SPEC-4001 linked to LAB-3001, PAT-1001, and ENC-2001.
- Specimen data include specimen identifier, collection status, collector identity, collection timestamp, and completion timestamp when applicable.
- LIS records specimen statuses as distinct events, such as CREATED, COLLECTED, and COMPLETED.
- LIS creates and owns report REP-5001 linked to LAB-3001, SPEC-4001, PAT-1001, and ENC-2001.
- Report data include report status, CBC components, values, units, reference ranges, abnormal flags, and release timestamp.
- LIS sends the completed REP-5001 to EHR/CPOE for clinical review.

### Success conditions

- SPEC-4001 progresses through valid statuses with the required timestamps.
- REP-5001 is released with status FINAL or COMPLETED and contains all required CBC data.
- EHR/CPOE stores or displays REP-5001 against LAB-3001 for the correct patient and encounter.
- EHR/CPOE returns a positive acknowledgement confirming receipt of REP-5001.
- The acknowledgement does not create or complete the report; LIS already owns the completed report.

### Failure conditions

- SPEC-4001 contains missing, inconsistent, or invalid identifiers or timestamps.
- REP-5001 contains missing identifiers, values, units, status, or release timestamp.
- EHR/CPOE rejects REP-5001 or returns no acknowledgement.

### Recovery conditions

- LIS retains the authoritative specimen and completed report records.
- Correct invalid data before retransmission.
- If delivery is uncertain, LIS retransmits the same REP-5001 identity.
- EHR/CPOE returns the stored result without creating a duplicate if REP-5001 was already accepted.

## Prescription and Pharmacist Verification

### User need

- After reviewing the CBC result, the physician needs to prescribe medication for PAT-1001 during ENC-2001.

### Expected event, data, and owner

- CPOE creates and owns medication order RX-1042.
- Required order data include PAT-1001, ENC-2001, medication identifier, strength, prescribed dose and unit, route, frequency, duration, quantity, ordering physician ID, and timestamp.
- CPOE sends RX-1042 to PMS, which stores a local copy and returns a receipt acknowledgement.
- The pharmacist reviews RX-1042 and creates verification record VER-6001 with the decision, pharmacist ID, timestamp, and any reason or note.
- PMS owns VER-6001 and sends the verification result to CPOE.

### Success conditions

- PMS accepts one copy of RX-1042 and acknowledges receipt to CPOE.
- The pharmacist records an explicit APPROVED or REJECTED decision in VER-6001.
- CPOE receives the verification result and acknowledges it to PMS.
- Receipt of RX-1042 is kept distinct from the pharmacist's verification decision.

### Failure conditions

- RX-1042 contains missing or invalid patient, encounter, medication, dose, route, frequency, quantity, or prescriber data.
- PMS rejects RX-1042 or CPOE receives no acknowledgement.
- VER-6001 cannot be stored or its delivery to CPOE fails.

### Recovery conditions

- Correct rejected data before resubmission.
- After an uncertain delivery, check the existing state and retransmit using the same RX-1042 or VER-6001 identity.
- Do not create a new medication order or verification record solely because an acknowledgement was lost.
- Return the previously stored status if the same identity was already processed.

## Dispensing and Inventory Movement

### User need

- The pharmacist needs to dispense the verified medication and have the actual dispensed quantity deducted from inventory exactly once.

### Expected event, data, and owner

- After an approved VER-6001, PMS creates and owns dispense record DES-7001 linked to RX-1042 and VER-6001.
- Dispense data include PAT-1001, ENC-2001, medication or stock-item identifier, strength, actual dispensed quantity and unit, pharmacist ID, and dispense timestamp.
- PMS sends the DES-7001 result to EHR/CPOE and receives an acknowledgement.
- After dispensing is completed, PMS sends inventory movement request MOV-8001 linked to DES-7001.
- Movement data include MOV-8001, DES-7001, stock-item identifier, actual dispensed quantity, unit, movement type, and timestamp.
- Inventory owns the applied MOV-8001 record and the authoritative stock balance.

### Success conditions

- PMS stores DES-7001 once and EHR/CPOE accepts the dispense notification.
- Inventory validates and applies MOV-8001 exactly once.
- The authoritative new balance equals the previous balance minus the actual dispensed quantity.
- Inventory returns MOV-8001 status, applied quantity, previous balance, and new balance to PMS.
- Any balance displayed in PMS is a non-authoritative copy of the Inventory result.

### Failure conditions

- DES-7001 or MOV-8001 contains missing or invalid identifiers, quantity, unit, or timestamp.
- EHR/CPOE rejects the dispense notification or returns no acknowledgement.
- Inventory rejects MOV-8001 or PMS receives no response, leaving the movement outcome unknown.

### Recovery conditions

- A failed dispense notification does not repeat the completed physical dispensing.
- PMS retries or queries Inventory using the same MOV-8001 identity.
- If Inventory already applied MOV-8001, it returns the stored result without another deduction.
- If MOV-8001 was not applied, Inventory validates and applies it once.
- PMS must not create a new movement identity solely because a response was lost.

## Discharge Authorization and Encounter Closure

### User need

- After reassessment, the physician needs to authorize discharge and the hospital needs to close the correct encounter.

### Expected event, data, and owner

- EHR creates and owns discharge authorization AUTH-8001 linked to PAT-1001 and ENC-2001.
- Required data include discharge summary, physician ID, authorization status, and authorization timestamp.
- EHR sends AUTH-8001 to HIS/PAS.
- After validating the authorization, HIS/PAS closes ENC-2001 and owns the authoritative encounter status and closure record.
- HIS/PAS sends the encounter-closure notification to each required downstream system.

### Success conditions

- HIS/PAS validates AUTH-8001 and changes ENC-2001 from OPEN to CLOSED exactly once.
- HIS/PAS returns a positive application acknowledgement containing the closure result to EHR.
- Each required downstream system accepts the closure notification and acknowledges receipt.

### Failure conditions

- AUTH-8001 is missing, invalid, or rejected, so ENC-2001 remains OPEN.
- HIS/PAS cannot close ENC-2001 and returns an error.
- A downstream system rejects the closure notification or returns no acknowledgement after ENC-2001 is closed.

### Recovery conditions

- If EHR retransmits AUTH-8001, HIS/PAS returns the existing state without closing ENC-2001 again.
- If closure failed, correct the cause and retry using the same authorization and encounter identities.
- If only a downstream notification failed, ENC-2001 remains CLOSED.
- HIS/PAS retries the same closure notification only to the failed destination.
