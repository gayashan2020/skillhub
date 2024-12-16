import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, ComponentType } from "react";

const withAuth = <P extends object>(Component: ComponentType<P>) => {
    return function ProtectedPage(props: P) {
        const router = useRouter();

        useEffect(() => {
            const secureRoute = async () => {
                const session = await getSession();
                if (!session) {
                    router.push("/login");
                }
            };

            secureRoute();
        }, [router]);

        return <Component {...props} />;
    };
};

export default withAuth;
