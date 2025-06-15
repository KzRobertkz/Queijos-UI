import { createClient } from "../../../../../../utils/supabase/server"
import { NewQueijoForm } from "@/components/newqueijoform";

export default async function NewQueijo() {

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const loggedUser = {
    id: data?.user?.id as string,
    email: data?.user?.email as string,
  }

  return (
    <div className="mt-40">
      <NewQueijoForm loggedUser={loggedUser} />
    </div>
  )
}
