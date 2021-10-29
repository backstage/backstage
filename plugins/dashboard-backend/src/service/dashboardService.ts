type DashboardData = {
    links: string[];
    contactList: {
        name: string;
        email: string;
    }[];
    cicd: {
        jenkins: number;
        github: number;
    };
    tests: {
        day: number;
        week: number;
        month: number;
    };
    acoe: {
        latestRelease: Date;
        releaseFailure: number;
        mttr: number;
    };
    health: number;
    twistLock: {
        low: number;
        medium: number;
        high: number;
        critical: number;
        riskFactors: number;
    };
    fortify: string;
    ato: {
        progress: number;
        renews: Date;
    };
    burnRate: number;
};

function randomFloat(topRange?: number) {
    if (topRange) {
        return Math.random() * topRange;
    }
    return Math.random();
}

function randomInteger(topRange?: number) {
    return Math.floor(randomFloat(topRange));
}

export const getDashboardData = (): DashboardData => {
    return {
        links: [
            'https://www.valink1.com',
            'https://www.valink2.com'
        ],
    contactList: [
        {
            name: 'James Madison',
            email: 'JamesMadison@va.gov'
        },
        {
            name: 'Ben Franklin',
            email: 'BFranklin@va.gov'
        },
        {
            name: 'Howard Taft',
            email: 'HHTaft@va.gov'
        }
    ],
    cicd: {
        jenkins: randomInteger(25),
        github: randomInteger(50),
    },
    tests: {
        day: randomInteger(7),
        week: randomInteger(35),
        month: randomInteger(150),
    },
    acoe: {
        latestRelease: new Date(),
        releaseFailure: randomFloat(),
        mttr: randomInteger(30),
    },
    health: randomFloat(),
    twistLock: {
        low: randomInteger(25),
        medium: randomInteger(30),
        high: randomInteger(10),
        critical: randomInteger(8),
        riskFactors: randomInteger(20),
    },
    fortify: 'fortified',
    ato: {
        progress: randomFloat(),
        renews: new Date(),
    },
    burnRate: randomFloat(),
    }
};
