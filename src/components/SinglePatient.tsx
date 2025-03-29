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

const ShowEntry = (props: EntryProps) => {
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
        {patient.entries.map(entry => <ShowEntry entry={entry} diagnoses={diagnoses} />)}
        </>
    );
}
else{
    return <h2>Not Found</h2>;
}
};

export default SinglePatient;