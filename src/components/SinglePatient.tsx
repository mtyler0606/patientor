import { useEffect, useState } from "react";
import { Patient, Entry } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import patientService from "../services/patients";
import { useParams } from "react-router-dom";

interface EntryProps {
    entry: Entry;
}

const ShowEntry = (props: EntryProps) => {
    return (
        <>
        <p>{props.entry.date} {props.entry.description}</p>
        {props.entry.diagnosisCodes &&
            <ul>
            {props.entry.diagnosisCodes.map((entry, index) => <li key={index}>{entry}</li>)}
        </ul>
}
        </>
    );
};
const SinglePatient = () => {

    const [patient, setPatient] = useState<Patient>();

    const id = useParams().id as string;

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatient = async () => {
      const patient = await patientService.getPatient(id);
      setPatient(patient);
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
        {patient.entries.map(entry => <ShowEntry entry={entry} />)}
        </>
    );
}
else{
    return <h2>Not Found</h2>;
}
};

export default SinglePatient;