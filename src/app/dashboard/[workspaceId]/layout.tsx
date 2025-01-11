import { onAuthenticateUser } from "@/actions/user";
import { verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import React from "react";
import { QueryClient,
    HydrationBoundary,
    dehydrate
 } from "@tanstack/react-query";

type Props = {
  params: {
    workspaceId: string;
  };
  children: React.ReactNode;
};

const Layout = async ({ params: { workspaceId }, children }: Props) => {
  const auth = await onAuthenticateUser();
  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if(!auth.user.workspace.length) redirect(`/auth/sign-in`);

  const hasAccess = await verifyAccessToWorkspace(workspaceId)

  if (hasAccess.status !==200) {
    redirect(`/dashboard/${auth.user.workspace[0].id}`);
  }
  if (!hasAccess.data?.workspace) {
   return null;
  }

  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId)
  })
   
  


  return <div>layout</div>;
};

export default Layout;
