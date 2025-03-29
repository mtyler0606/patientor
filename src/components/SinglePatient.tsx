import { useEffect, useState } from "react";
import { Patient, Entry, Diagnosis } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import patientService from "../services/patients";
import diagnosesService from "../services/diagnoses";
import { useParams } from "react-router-dom";


interface EntryProps {
    entry: Entry;
    diagnoses: Diagnosis[] | undefined;
}
const getDiagnoses = (code:string, diagonses: Diagnosis[] ) => {
    const diagnosis = diagonses.find(diagnosis => diagnosis.code === code);
    if(diagnosis){
        return diagnosis.name;
    }
};
const toDiagnonsesArray = (arr: Diagnosis[] | undefined) => {
    if(arr){
        return arr;
    }
    else {
        const arr = [] as Diagnosis[];
        return arr;
    }
};

const HealthCheckEntry = (props: EntryProps) => {
    return (
        <>
        <p>{props.entry.date} {props.entry.description}</p>
        {props.entry.diagnosisCodes &&
            <ul>
            {props.entry.diagnosisCodes.map((entry, index) => <li key={index}>{entry} {getDiagnoses(entry, toDiagnonsesArray(props.diagnoses))}</li>)}
        </ul>
}
        </>
    );
};

const HospitalEntry = (props: EntryProps) => {
    return (
        <>
        <p>{props.entry.date} {props.entry.description}</p>
        {props.entry.diagnosisCodes &&
            <ul>
            {props.entry.diagnosisCodes.map((entry, index) => <li key={index}>{entry} {getDiagnoses(entry, toDiagnonsesArray(props.diagnoses))}</li>)}
        </ul>
}
        </>
    );
};

const OccupationalEntry = (props: EntryProps) => {
    return (
        <>
        <p>{props.entry.date} {props.entry.description}</p>
        {props.entry.diagnosisCodes &&
            <ul>
            {props.entry.diagnosisCodes.map((entry, index) => <li key={index}>{entry} {getDiagnoses(entry, toDiagnonsesArray(props.diagnoses))}</li>)}
        </ul>
}
        </>
    );
};

const ShowEntry = (props: EntryProps) => {
    /*
    switch(props.entry.type){
        case "HealthCheck":
            return <HealthCheckEntry entry={props.entry} diagnoses={props.diagnoses}/>;
        case "OccupationalHealthcare":
            return <OccupationalEntry entry={props.entry} diagnoses={props.diagnoses} />;
        case "Hospital":
            return <HospitalEntry entry={props.entry} diagnoses={props.diagnoses} />;
    }
    */
    return (
        <>
        <h3>{props.entry.date}</h3>
        
        <p>Type : {props.entry.type}</p>
        <p>Description: {props.entry.description}</p>
        <p>diagnosed by {props.entry.specialist}</p>
        <h4>Diagnosis Codes</h4>
        {props.entry.diagnosisCodes &&
            <ul>
            {props.entry.diagnosisCodes.map((entry, index) => <li key={index}>{entry} {getDiagnoses(entry, toDiagnonsesArray(props.diagnoses))}</li>)}
        </ul>
}
        {
            (props.entry.type === "HealthCheck") && 
            <p>Health check rating: {props.entry.healthCheckRating}</p>
            }
        {
            (props.entry.type === "Hospital") &&
            <p>Discharge: {props.entry.discharge.date} {props.entry.discharge.criteria}</p>
        }
        {
            (props.entry.type === "OccupationalHealthcare") &&
            <p>Employer: {props.entry.employerName} </p>
        }
        { (props.entry.type === "OccupationalHealthcare") && (props.entry.sickLeave != undefined) && <p>Sickleave from: {props.entry.sickLeave.startDate} to: {props.entry.sickLeave.endDate}</p>}

        </>
    );
};


const SinglePatient = () => {

    const [patient, setPatient] = useState<Patient>();
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

    const id = useParams().id as string;

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatient = async () => {
      const patient = await patientService.getPatient(id);
      setPatient(patient);
      const allDiagnoses = await diagnosesService.getAllDiagnoses();
      setDiagnoses(allDiagnoses);
    };
    void fetchPatient();
  }, []);

  if(patient){
    return (
        <>
        <h2>{patient.name} {patient.gender}</h2>
        <p>ssn : {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        <h3>entries</h3>
        {patient.entries.map((entry, index) => <ShowEntry key={index} entry={entry} diagnoses={diagnoses} />)}
        </>
    );
}
else{
    return <h2>Not Found</h2>;
}
};

export default SinglePatient;