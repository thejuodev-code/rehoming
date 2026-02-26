export default async function DebugPage() {
    let data_list = null;
    let data_single = null;
    try {
        const resList = await fetch('https://lovejuo123.mycafe24.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                query: '{ animals(first: 1) { nodes { id slug } } }'
            }),
            cache: 'no-store'
        });
        data_list = await resList.json();

        const slug = data_list?.data?.animals?.nodes?.[0]?.slug;

        if (slug) {
            const resSingle = await fetch('https://lovejuo123.mycafe24.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                body: JSON.stringify({
                    query: `query { animal(id: "${slug}", idType: SLUG) { title slug } }`
                }),
                cache: 'no-store'
            });
            data_single = await resSingle.json();
        }

    } catch (err: any) {
        data_list = err.toString();
    }

    return (
        <div style={{ padding: '50px' }}>
            <h1>Schema Debug output:</h1>
            <h2>List</h2>
            <pre>{JSON.stringify(data_list, null, 2)}</pre>
            <h2>Single</h2>
            <pre>{JSON.stringify(data_single, null, 2)}</pre>
        </div>
    );
}
