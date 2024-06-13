export enum GENDER {
    MALE = 'Male',
    FEMALE = 'Female',
    Other = 'Other' 
}

export enum UNIVERSITY {
    SRI_JAYEWARDENEPURA = 'University of Sri Jayewardenepura',
    COLOMBO = 'University of Colombo',
    PERADENIYA = 'University of Peradeniya',
    KELANIYA = 'University of Kelaniya',
    MORATUWA = 'University of Moratuwa',
    JAFFNA = 'University of Jaffna',
    RUHUNA = 'University of Ruhuna',
    OPEN_UNIVERSITY = 'The Open University of Sri Lanka',
    EASTERN = 'Eastern University, Sri Lanka',
    SOUTH_EASTERN = 'South Eastern University of Sri Lanka',
    RAJARATA = 'Rajarata University of Sri Lanka',
    SABARAGAMUWA = 'Sabaragamuwa University of Sri Lanka',
    WAYAMBA = 'Wayamba University of Sri Lanka',
    UVA_WELLASSA = 'Uva Wellassa University',
    VISUAL_PERFORMING_ARTS = 'University of the Visual & Performing Arts',
    GAMPANA_WICKRAMARACHCHI = 'University of the Sri Lanka (Gampaha Wickramarachchi Ayurveda Institute)',
    MORATUWA_TECHNOLOGY = 'Institute of Technology University of Moratuwa',
    VAUNIYA = 'University of Vavuniya',
}

export enum ACADEMICYEAR {
    Year1 = '1st Year (22/23)',
    Year2 = '2nd Year (21/22)',
    Year3 = '3rd Year (20/21)',
    Year4 = '4th Year (19/20)',
    Year5 = '5th Year (18/19)',
}

export enum FACULTY {
    MANAGEMENT_STUDIES_AND_COMMERCE = 'Faculty of Management Studies & Commerce',
    APPLIED_SCIENCES = 'Faculty of Applied Sciences',
    HUMANITIES_AND_SOCIAL_SCIENCES = 'Faculty of Humanities and Social Sciences',
    ALLIED_HEALTH_SCIENCES = 'Faculty of Allied Health Sciences',
    TECHNOLOGY = 'Faculty of Technology',
    ENGINEERING = 'Faculty of Engineering',
    MEDICAL_SCIENCE = 'Faculty of Medical Science'
}

export enum DEGREE {
    ACCOUNTING_SPECIAL = 'B.Sc. Accounting (Special) Degree',
    FINANCE_SPECIAL = 'B.Sc. Finance (Special) Degree',
    BUSINESS_ADMINISTRATION_SPECIAL = 'B.Sc. Business Administration (Special) Degree',
    BUSINESS_ADMINISTRATION_ECONOMIC_SPECIAL = 'B.Sc. Business Administration (Business Economic) (Special) Degree',
    MARKETING_MANAGEMENT_SPECIAL = 'B.Sc. Marketing Management (Special) Degree',
    OPERATIONS_TECHNOLOGY_MANAGEMENT_SPECIAL = 'B.Sc. Operations and Technology Management (Special) Degree',
    HUMAN_RESOURCES_MANAGEMENT_SPECIAL = 'B.Sc. Human Resources Management (Special) Degree',
    ENTREPRENEURSHIP_SPECIAL = 'B.Sc. Entrepreneurship (Special) Degree',
    BUSINESS_INFORMATION_SYSTEMS_SPECIAL = 'B.Sc. Business Information Systems (Special) Degree',
    PUBLIC_MANAGEMENT_SPECIAL = 'B.Sc. Public Management (Special) Degree',
    ESTATE_MANAGEMENT_VALUATION_SPECIAL = 'B.Sc. Estate Management and Valuation (Special) Degree',
    COM_SPECIAL = 'B.Com (Special) Degree',

    GENERAL_3YEARS = 'B.Sc. (General) Degree (3 years)',
    SPECIAL_4YEARS = 'B.Sc. (Special) Degree (4 years)',
    HONOURS_APPLIED_SCIENCES_4YEARS = 'B.Sc. Honours Degree in Applied Sciences (4 years)',
    FOOD_SCIENCE_TECHNOLOGY_SPECIAL = 'B.Sc. Food Science and Technology (Special) Degree',
    SPORT_SCIENCE_MANAGEMENT_SPECIAL = 'B.Sc. Sport Science and Management (Special) Degree',

    BA_GENERAL = 'B.A. (General) Degree',
    BSC_INFORMATION_TECHNOLOGY_SPECIAL = 'B.Sc. Information Technology (Special) Degree',
    BA_GEOGRAPHY_SPECIAL = 'B.A. Geography (Special) Degree',
    BA_SINHALA_SPECIAL = 'B.A. Sinhala (Special) Degree',
    BA_MASS_COMMUNICATION_SPECIAL = 'B.A. Mass Communication (Special) Degree',
    BA_ARCHAEOLOGY_SPECIAL = 'B.A. Archaeology (Special) Degree',
    BA_HISTORY_SPECIAL = 'B.A. History (Special) Degree',
    BA_CRIMINOLOGY_CRIMINAL_JUSTICE_SPECIAL = 'B.A. Criminology and Criminal Justice (Special) Degree',
    BA_HINDI_SPECIAL = 'B.A. Hindi (Special) Degree',
    BA_DANCING_SPECIAL = 'B.A. Dancing (Special) Degree',
    BA_MUSIC_SPECIAL = 'B.A. Music (Special) Degree',
    BA_SANSKRIT_SPECIAL = 'B.A. Sanskrit (Special) Degree',
    BA_POLITICAL_SCIENCE_SPECIAL = 'B.A. Political Science (Special) Degree',
    BA_BUSINESS_STATISTICS_SPECIAL = 'B.A. Business Statistics (Special) Degree',
    BA_SOCIAL_STATISTICS_SPECIAL = 'B.A. Social Statistics (Special) Degree',
    BA_ENGLISH_LANGUAGE_SPECIAL = 'B.A. English Language (Special) Degree',
    BA_ENGLISH_LITERATURE_SPECIAL = 'B.A. English Literature (Special) Degree',
    BA_TESL_SPECIAL = 'B.A. Teaching English as a Second Language (TESL) (Special) Degree',
    BA_ECONOMICS_SPECIAL = 'B.A. Economics (Special) Degree',
    BA_PALI_SPECIAL = 'B.A. Pali (Special) Degree',
    BA_BUDDHIST_CIVILIZATION_SPECIAL = 'B.A. Buddhist Civilization (Special) Degree',
    BA_BUDDHIST_PHILOSOPHY_SPECIAL = 'B.A. Buddhist Philosophy (Special) Degree',
    BA_SOCIOLOGY_SPECIAL = 'B.A. Sociology (Special) Degree',
    BA_ANTHROPOLOGY_SPECIAL = 'B.A. Anthropology (Special) Degree',
    BA_PHILOSOPHY_PSYCHOLOGY_SPECIAL = 'B.A. Philosophy and Psychology (Special) Degree',
    BA_BUDDHIST_HERITAGE_TOURISM_SPECIAL = 'B.A. Buddhist Heritage & Tourism (Special) Degree',
    BSC_HONOURS_GEO_SPATIAL_TECHNOLOGY = 'B.Sc. Honours in Geo-Spatial Technology',

    MEDICAL_LAB_SCIENCES = 'B.Sc. in Medical Laboratory Sciences',
    NURSING = 'B.Sc. in Nursing',
    PHARM_HONS = 'B.Pharm(Hons)',
    OPTOMETRY = 'B.Sc in Optometry',

    BIOSYSTEMS_TECHNOLOGY_HONOURS = 'Bachelor of Biosystems Technology (Honours) Degree',
    ENGINEERING_TECHNOLOGY_HONOURS = 'Bachelor of Engineering Technology (Honours) Degree',
    INFORMATION_COMMUNICATION_TECHNOLOGY_HONOURS = 'Bachelor of Information and Communication Technology (Honours) Degree',

    COMPUTER_ENGINEERING_SPECIAL = 'B.Sc.Computer Engineering (Special) Degree',
    CIVIL_ENGINEERING_SPECIAL = 'B.Sc.Civil Engineering (Special) Degree',
    ELECTRICAL_ELECTRONIC_ENGINEERING_SPECIAL = 'B.Sc.Electrical and Electronic Engineering (Special) Degree',
    MECHANICAL_ENGINEERING_SPECIAL = 'B.Sc.Mechanical Engineering (Special) Degree',
    
    MBBS = 'MBBS',
    HUMAN_BIOLOGY = 'B.Sc. in Human Biology',

    Other = 'Other'
}

export enum AWARDS {
    BEST_LEADER = 'Best Leader',
    BEST_TEAM_PLAYER = 'Best Team Player',
    BEST_CREATIVE_DESIGNER = 'Best Creative Designer',
    BEST_COMMUNICATOR = 'Best Communicator',
    BEST_INNOVATOR = 'Best Innovator',
    BEST_YOUNG_ENTREPRENEUR = 'Best Young Entrepreneur',
    BESA_MANAGEMENT_STUDIES_AND_COMMERCE = 'BESA (Faculty of Management Studies and Commerce)',
    BESA_APPLIED_SCIENCES = 'BESA (Faculty of Applied Sciences)',
    BESA_HUMANITIES_AND_SOCIAL_SCIENCES = 'BESA (Faculty of Humanities and Social Sciences)',
    BESA_MEDICAL_SCIENCES = 'BESA (Faculty of Medical Sciences)',
    BESA_TECHNOLOGY = 'BESA (Faculty of Technology)',
    BESA_ENGINEERING = 'BESA (Faculty of Engineering)',
    BESA_ALLIED_HEALTH_SCIENCES = 'BESA (Faculty of Allied Health Sciences)',
    CSR_AWARD = 'CSR Award',
}


export enum MGT_DEGREE {
    ACCOUNTING_SPECIAL = 'B.Sc. Accounting (Special) Degree',
    FINANCE_SPECIAL = 'B.Sc. Finance (Special) Degree',
    BUSINESS_ADMINISTRATION_SPECIAL = 'B.Sc. Business Administration (Special) Degree',
    BUSINESS_ADMINISTRATION_ECONOMIC_SPECIAL = 'B.Sc. Business Administration (Business Economic) (Special) Degree',
    MARKETING_MANAGEMENT_SPECIAL = 'B.Sc. Marketing Management (Special) Degree',
    OPERATIONS_TECHNOLOGY_MANAGEMENT_SPECIAL = 'B.Sc. Operations and Technology Management (Special) Degree',
    HUMAN_RESOURCES_MANAGEMENT_SPECIAL = 'B.Sc. Human Resources Management (Special) Degree',
    ENTREPRENEURSHIP_SPECIAL = 'B.Sc. Entrepreneurship (Special) Degree',
    BUSINESS_INFORMATION_SYSTEMS_SPECIAL = 'B.Sc. Business Information Systems (Special) Degree',
    PUBLIC_MANAGEMENT_SPECIAL = 'B.Sc. Public Management (Special) Degree',
    ESTATE_MANAGEMENT_VALUATION_SPECIAL = 'B.Sc. Estate Management and Valuation (Special) Degree',
    COM_SPECIAL = 'B.Com (Special) Degree'
}

export enum APPL_DEGREE {
    GENERAL_3YEARS = 'B.Sc. (General) Degree (3 years)',
    SPECIAL_4YEARS = 'B.Sc. (Special) Degree (4 years)',
    HONOURS_APPLIED_SCIENCES_4YEARS = 'B.Sc. Honours Degree in Applied Sciences (4 years)',
    FOOD_SCIENCE_TECHNOLOGY_SPECIAL = 'B.Sc. Food Science and Technology (Special) Degree',
    SPORT_SCIENCE_MANAGEMENT_SPECIAL = 'B.Sc. Sport Science and Management (Special) Degree',
    OTHER = 'Other'
}

export enum HUM_DEGREE {
    BA_GENERAL = 'B.A. (General) Degree',
    BSC_INFORMATION_TECHNOLOGY_SPECIAL = 'B.Sc. Information Technology (Special) Degree',
    BA_GEOGRAPHY_SPECIAL = 'B.A. Geography (Special) Degree',
    BA_SINHALA_SPECIAL = 'B.A. Sinhala (Special) Degree',
    BA_MASS_COMMUNICATION_SPECIAL = 'B.A. Mass Communication (Special) Degree',
    BA_ARCHAEOLOGY_SPECIAL = 'B.A. Archaeology (Special) Degree',
    BA_HISTORY_SPECIAL = 'B.A. History (Special) Degree',
    BA_CRIMINOLOGY_CRIMINAL_JUSTICE_SPECIAL = 'B.A. Criminology and Criminal Justice (Special) Degree',
    BA_HINDI_SPECIAL = 'B.A. Hindi (Special) Degree',
    BA_DANCING_SPECIAL = 'B.A. Dancing (Special) Degree',
    BA_MUSIC_SPECIAL = 'B.A. Music (Special) Degree',
    BA_SANSKRIT_SPECIAL = 'B.A. Sanskrit (Special) Degree',
    BA_POLITICAL_SCIENCE_SPECIAL = 'B.A. Political Science (Special) Degree',
    BA_BUSINESS_STATISTICS_SPECIAL = 'B.A. Business Statistics (Special) Degree',
    BA_SOCIAL_STATISTICS_SPECIAL = 'B.A. Social Statistics (Special) Degree',
    BA_ENGLISH_LANGUAGE_SPECIAL = 'B.A. English Language (Special) Degree',
    BA_ENGLISH_LITERATURE_SPECIAL = 'B.A. English Literature (Special) Degree',
    BA_TESL_SPECIAL = 'B.A. Teaching English as a Second Language (TESL) (Special) Degree',
    BA_ECONOMICS_SPECIAL = 'B.A. Economics (Special) Degree',
    BA_PALI_SPECIAL = 'B.A. Pali (Special) Degree',
    BA_BUDDHIST_CIVILIZATION_SPECIAL = 'B.A. Buddhist Civilization (Special) Degree',
    BA_BUDDHIST_PHILOSOPHY_SPECIAL = 'B.A. Buddhist Philosophy (Special) Degree',
    BA_SOCIOLOGY_SPECIAL = 'B.A. Sociology (Special) Degree',
    BA_ANTHROPOLOGY_SPECIAL = 'B.A. Anthropology (Special) Degree',
    BA_PHILOSOPHY_PSYCHOLOGY_SPECIAL = 'B.A. Philosophy and Psychology (Special) Degree',
    BA_BUDDHIST_HERITAGE_TOURISM_SPECIAL = 'B.A. Buddhist Heritage & Tourism (Special) Degree',
    BSC_HONOURS_GEO_SPATIAL_TECHNOLOGY = 'B.Sc. Honours in Geo-Spatial Technology',
}

export enum ALMED_DEGREE {
    MEDICAL_LAB_SCIENCES = 'B.Sc. in Medical Laboratory Sciences',
    NURSING = 'B.Sc. in Nursing',
    PHARM_HONS = 'B.Pharm(Hons)',
    OPTOMETRY = 'B.Sc in Optometry',
}

export enum TECH_DEGREE {
    BIOSYSTEMS_TECHNOLOGY_HONOURS = 'Bachelor of Biosystems Technology (Honours) Degree',
    ENGINEERING_TECHNOLOGY_HONOURS = 'Bachelor of Engineering Technology (Honours) Degree',
    INFORMATION_COMMUNICATION_TECHNOLOGY_HONOURS = 'Bachelor of Information and Communication Technology (Honours) Degree',
}

export enum ENG_DEGREE {
    COMPUTER_ENGINEERING_SPECIAL = 'B.Sc.Computer Engineering (Special) Degree',
    CIVIL_ENGINEERING_SPECIAL = 'B.Sc.Civil Engineering (Special) Degree',
    ELECTRICAL_ELECTRONIC_ENGINEERING_SPECIAL = 'B.Sc.Electrical and Electronic Engineering (Special) Degree',
    MECHANICAL_ENGINEERING_SPECIAL = 'B.Sc.Mechanical Engineering (Special) Degree',
}

export enum MED_DEGREE {
    MBBS = 'MBBS',
    HUMAN_BIOLOGY = 'B.Sc. in Human Biology',
}