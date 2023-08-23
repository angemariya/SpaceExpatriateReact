import styles from "./Resource.module.scss";
import { Resource } from "../../Rules/card-types";
import { log } from "console";

export interface ResourceComponentProps {
  type: Resource;
}

export const ResourceComponent = (props: ResourceComponentProps) => {
  const normalisedType =
    typeof props.type === "string"
      ? [props.type.split(" ").join("-")]
      : props.type.map((el) => el.split(" ").join("-"));
  return (
    <> 
    {normalisedType.map((el, ind) =>  <> <div className={`${styles[el]} ${styles.resource}` }> {el} </div>  {  ind !== normalisedType.length-1 && "/" } </>  ) }
    </>
  );
};
