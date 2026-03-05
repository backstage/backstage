import{p as E,j as e,B as w}from"./iframe-CdLF-10Q.js";import{S as s}from"./Select-CzDyXbJY.js";import{$ as z}from"./Form-C-WxKBjf.js";import{T as j}from"./index-BZcCuUDL.js";import{F as D}from"./Flex-CqEGkJmz.js";import{T as B}from"./Text-XLgIKV8R.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-6PVogJ8A.js";import"./Button-D5bVafo8.js";import"./utils-BnW3RBJ3.js";import"./useObjectRef-DYP99nzj.js";import"./Label-BU74oYts.js";import"./Hidden-DlxWCHts.js";import"./useFocusable-MVXEAhd0.js";import"./useLabel-DqD24Hft.js";import"./useLabels-Tka62wiR.js";import"./context-CV6LGc3q.js";import"./useButton-C_fuvybR.js";import"./usePress-BQnEWoDc.js";import"./useFocusRing-cMOd4ybf.js";import"./RSPContexts-B0Ox74it.js";import"./OverlayArrow-DL2ZQlBr.js";import"./useControlledState-jeQ8CNnB.js";import"./SelectionManager-DZgKxdnj.js";import"./useEvent-DZS5asNv.js";import"./SelectionIndicator-BV8dDJwx.js";import"./Separator-DlUgv5Q1.js";import"./Text-Cppq_ocy.js";import"./useLocalizedStringFormatter-DD5464Dv.js";import"./animation-CLI2z2XA.js";import"./VisuallyHidden-DBVU6LwL.js";import"./FieldError-D6Jr3x5H.js";import"./ListBox-SGuOXyfg.js";import"./useListState--W3NAG1L.js";import"./useField-CYyjrOjz.js";import"./useFormReset-DcRD1lVQ.js";import"./definition-CGZ68JDi.js";import"./Autocomplete-D6utHRC8.js";import"./Input-keRrK3MT.js";import"./SearchField-DLlUvKzl.js";import"./FieldError-DXe40lF2.js";import"./FieldLabel-CKuifpvk.js";const t=E.meta({title:"Backstage UI/Select",component:s,args:{style:{width:300}}}),T=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],G=[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"mx",label:"Mexico"},{value:"uk",label:"United Kingdom"},{value:"fr",label:"France"},{value:"de",label:"Germany"},{value:"it",label:"Italy"},{value:"es",label:"Spain"},{value:"jp",label:"Japan"},{value:"cn",label:"China"},{value:"in",label:"India"},{value:"br",label:"Brazil"},{value:"au",label:"Australia"}],K=[{value:"react",label:"React"},{value:"typescript",label:"TypeScript"},{value:"javascript",label:"JavaScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"kotlin",label:"Kotlin"},{value:"swift",label:"Swift"}],r=t.story({args:{options:T,name:"font"}}),c=t.story({args:{label:"Country",searchable:!0,searchPlaceholder:"Search countries...",options:G}}),p=t.story({args:{label:"Select multiple options",selectionMode:"multiple",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"}]}}),u=t.story({args:{label:"Skills",searchable:!0,selectionMode:"multiple",searchPlaceholder:"Filter skills...",options:K}}),n=t.story({args:{label:"Font Family",options:T,placeholder:"Select a font",name:"font",style:{maxWidth:260}}}),o=t.story({args:{...r.input.args,label:"Font Family"}}),d=t.story({args:{...r.input.args,label:"Font Family",style:{width:"100%"}}}),m=t.story({args:{...o.input.args,description:"Choose a font family for your document"}}),g=t.story({args:{...o.input.args},render:a=>e.jsx(s,{...a,icon:e.jsx(j,{})})}),h=t.story({args:{...n.input.args},render:a=>e.jsxs(D,{direction:"row",gap:"2",children:[e.jsx(s,{...a,size:"small",icon:e.jsx(j,{})}),e.jsx(s,{...a,size:"medium",icon:e.jsx(j,{})})]})}),y=t.story({args:{...n.input.args,isRequired:!0}}),b=t.story({args:{...n.input.args,isDisabled:!0}}),f=t.story({args:{...n.input.args,disabledKeys:["cursive","serif"]}}),S=t.story({args:{...n.input.args,options:void 0}}),v=t.story({args:{...n.input.args,selectedKey:"mono",defaultSelectedKey:"serif"}}),x=t.story({args:{...n.input.args,defaultSelectedKey:"serif",options:T,name:"font"}}),U=(a=100)=>{const O=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],I=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],L=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],M=i=>i[Math.floor(Math.random()*i.length)],k=Array.from({length:a}).map(()=>{const i=M(O),R=M(I),N=M(L);return`${i}${R} ${N}`}).reduce((i,R)=>(i.add(R),i),new Set).values();return Array.from(k).map(i=>({value:i.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:i}))},F=t.story({args:{label:"Font Family",options:U(),name:"font"}}),P=t.story({args:{...o.input.args,name:"font"},render:a=>e.jsx(z,{validationErrors:{font:"Invalid font family"},children:e.jsx(s,{...a})})}),l=t.story({args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}}),C=t.story({args:{...l.input.args},decorators:[(a,{args:O})=>e.jsx("div",{style:{padding:128},children:e.jsx(a,{...O})})]}),A=t.story({render:()=>e.jsxs(D,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Select automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(w,{bg:"neutral",p:"4",children:[e.jsx(B,{children:"Neutral 1 container"}),e.jsx(D,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(s,{options:T,"aria-label":"Font family"})})]}),e.jsx(w,{bg:"neutral",children:e.jsxs(w,{bg:"neutral",p:"4",children:[e.jsx(B,{children:"Neutral 2 container"}),e.jsx(D,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(s,{options:T,"aria-label":"Font family"})})]})}),e.jsx(w,{bg:"neutral",children:e.jsx(w,{bg:"neutral",children:e.jsxs(w,{bg:"neutral",p:"4",children:[e.jsx(B,{children:"Neutral 3 container"}),e.jsx(D,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(s,{options:T,"aria-label":"Font family"})})]})})})]})}),W=t.story({args:{...r.input.args},render:a=>e.jsxs(D,{direction:"column",gap:"4",children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),e.jsx(s,{...a,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),e.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),e.jsx(s,{...a,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => (
  <Select style={{ width: 300 }} options={fontOptions} name="font" />
);
`,...r.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Searchable = () => (
  <Select
    style={{ width: 300 }}
    label="Country"
    searchable
    searchPlaceholder="Search countries..."
    options={countries}
  />
);
`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const MultipleSelection = () => (
  <Select
    style={{ width: 300 }}
    label="Select multiple options"
    selectionMode="multiple"
    options={[
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
      { value: "option4", label: "Option 4" },
    ]}
  />
);
`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const SearchableMultiple = () => (
  <Select
    style={{ width: 300 }}
    label="Skills"
    searchable
    selectionMode="multiple"
    searchPlaceholder="Filter skills..."
    options={skills}
  />
);
`,...u.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Preview = () => (
  <Select
    style={{ maxWidth: 260 }}
    label="Font Family"
    options={fontOptions}
    placeholder="Select a font"
    name="font"
  />
);
`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const WithLabel = () => <Select style={{ width: 300 }} label="Font Family" />;
`,...o.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const WithFullWidth = () => (
  <Select style={{ width: "100%" }} label="Font Family" />
);
`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const WithLabelAndDescription = () => (
  <Select
    style={{ width: 300 }}
    description="Choose a font family for your document"
  />
);
`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const WithIcon = () => <Select style={{ width: 300 }} icon={<RiCloudLine />} />;
`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="2">
    <Select style={{ width: 300 }} size="small" icon={<RiCloudLine />} />
    <Select style={{ width: 300 }} size="medium" icon={<RiCloudLine />} />
  </Flex>
);
`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const Required = () => <Select style={{ width: 300 }} isRequired />;
`,...y.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const Disabled = () => <Select style={{ width: 300 }} isDisabled />;
`,...b.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{code:`const DisabledOption = () => (
  <Select style={{ width: 300 }} disabledKeys={["cursive", "serif"]} />
);
`,...f.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{code:`const NoOptions = () => <Select style={{ width: 300 }} options={undefined} />;
`,...S.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const WithValue = () => (
  <Select
    style={{ width: 300 }}
    selectedKey="mono"
    defaultSelectedKey="serif"
  />
);
`,...v.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const WithDefaultValue = () => (
  <Select
    style={{ width: 300 }}
    defaultSelectedKey="serif"
    options={fontOptions}
    name="font"
  />
);
`,...x.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{code:`const WithManyOptions = () => (
  <Select
    style={{ width: 300 }}
    label="Font Family"
    options={generateOptions()}
    name="font"
  />
);
`,...F.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{code:`const WithError = () => (
  <Form validationErrors={{ font: "Invalid font family" }}>
    <Select style={{ width: 300 }} name="font" />
  </Form>
);
`,...P.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const WithLongNames = () => (
  <Select
    style={{ maxWidth: 400 }}
    label="Document Template"
    options={[
      {
        value: "annual-report-2024",
        label:
          "Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions",
      },
      {
        value: "product-roadmap",
        label:
          "Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings",
      },
      {
        value: "user-guide",
        label:
          "Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions",
      },
      {
        value: "marketing-plan",
        label:
          "Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology",
      },
      {
        value: "research-paper",
        label:
          "Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines",
      },
    ]}
    placeholder="Select a document template"
    name="template"
    defaultSelectedKey="annual-report-2024"
  />
);
`,...l.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{code:`const WithLongNamesAndPadding = () => <Select style={{ width: 300 }} />;
`,...C.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{code:`const AutoBg = () => (
  <Flex direction="column" gap="4">
    <div style={{ maxWidth: "600px" }}>
      Select automatically detects its parent bg context and increments the
      neutral level by 1. No prop is needed — it's fully automatic.
    </div>
    <Box bg="neutral" p="4">
      <Text>Neutral 1 container</Text>
      <Flex mt="2" style={{ maxWidth: "300px" }}>
        <Select options={fontOptions} aria-label="Font family" />
      </Flex>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral" p="4">
        <Text>Neutral 2 container</Text>
        <Flex mt="2" style={{ maxWidth: "300px" }}>
          <Select options={fontOptions} aria-label="Font family" />
        </Flex>
      </Box>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 3 container</Text>
          <Flex mt="2" style={{ maxWidth: "300px" }}>
            <Select options={fontOptions} aria-label="Font family" />
          </Flex>
        </Box>
      </Box>
    </Box>
  </Flex>
);
`,...A.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{code:`const WithAccessibilityProps = () => (
  <Flex direction="column" gap="4">
    <div>
      <h3 style={{ marginBottom: 8 }}>With aria-label</h3>
      <Select
        style={{ width: 300 }}
        aria-label="Choose font family"
        placeholder="Select a font family"
        name="font-aria"
      />
    </div>
    <div>
      <h3 style={{ marginBottom: 8 }}>With aria-labelledby</h3>
      <div id="font-label" style={{ marginBottom: 8, fontWeight: 600 }}>
        Font Family Selection
      </div>
      <Select
        style={{ width: 300 }}
        aria-labelledby="font-label"
        placeholder="Select a font family"
        name="font-labelledby"
      />
    </div>
  </Flex>
);
`,...W.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    options: fontOptions,
    name: 'font'
  }
})`,...r.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Country',
    searchable: true,
    searchPlaceholder: 'Search countries...',
    options: countries
  }
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Select multiple options',
    selectionMode: 'multiple',
    options: [{
      value: 'option1',
      label: 'Option 1'
    }, {
      value: 'option2',
      label: 'Option 2'
    }, {
      value: 'option3',
      label: 'Option 3'
    }, {
      value: 'option4',
      label: 'Option 4'
    }]
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Skills',
    searchable: true,
    selectionMode: 'multiple',
    searchPlaceholder: 'Filter skills...',
    options: skills
  }
})`,...u.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: {
      maxWidth: 260
    }
  }
})`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family'
  }
})`,...o.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
})`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document'
  }
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
})`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isRequired: true
  }
})`,...y.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true
  }
})`,...b.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif']
  }
})`,...f.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    options: undefined
  }
})`,...S.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif'
  }
})`,...v.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
})`,...x.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
})`,...F.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
})`,...P.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Document Template',
    options: [{
      value: 'annual-report-2024',
      label: 'Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions'
    }, {
      value: 'product-roadmap',
      label: 'Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings'
    }, {
      value: 'user-guide',
      label: 'Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions'
    }, {
      value: 'marketing-plan',
      label: 'Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology'
    }, {
      value: 'research-paper',
      label: 'Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines'
    }],
    placeholder: 'Select a document template',
    name: 'template',
    style: {
      maxWidth: 400
    },
    defaultSelectedKey: 'annual-report-2024'
  }
})`,...l.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLongNames.input.args
  },
  decorators: [(Story, {
    args
  }) => <div style={{
    padding: 128
  }}>
        <Story {...args} />
      </div>]
})`,...C.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <div style={{
      maxWidth: '600px'
    }}>
        Select automatically detects its parent bg context and increments the
        neutral level by 1. No prop is needed — it's fully automatic.
      </div>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2" style={{
        maxWidth: '300px'
      }}>
          <Select options={fontOptions} aria-label="Font family" />
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex mt="2" style={{
          maxWidth: '300px'
        }}>
            <Select options={fontOptions} aria-label="Font family" />
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex mt="2" style={{
            maxWidth: '300px'
          }}>
              <Select options={fontOptions} aria-label="Font family" />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
})`,...A.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="column" gap="4">
      <div>
        <h3 style={{
        marginBottom: 8
      }}>With aria-label</h3>
        <Select {...args} aria-label="Choose font family" placeholder="Select a font family" name="font-aria" />
      </div>
      <div>
        <h3 style={{
        marginBottom: 8
      }}>With aria-labelledby</h3>
        <div id="font-label" style={{
        marginBottom: 8,
        fontWeight: 600
      }}>
          Font Family Selection
        </div>
        <Select {...args} aria-labelledby="font-label" placeholder="Select a font family" name="font-labelledby" />
      </div>
    </Flex>
})`,...W.input.parameters?.docs?.source}}};const Re=["Default","Searchable","MultipleSelection","SearchableMultiple","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","AutoBg","WithAccessibilityProps"];export{A as AutoBg,r as Default,b as Disabled,f as DisabledOption,p as MultipleSelection,S as NoOptions,n as Preview,y as Required,c as Searchable,u as SearchableMultiple,h as Sizes,W as WithAccessibilityProps,x as WithDefaultValue,P as WithError,d as WithFullWidth,g as WithIcon,o as WithLabel,m as WithLabelAndDescription,l as WithLongNames,C as WithLongNamesAndPadding,F as WithManyOptions,v as WithValue,Re as __namedExportsOrder};
