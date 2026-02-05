import{p as j,j as t}from"./iframe-M9O-K8SB.js";import{S as w}from"./Select-CLJvQpV8.js";import{$ as E}from"./Form-BBJy9cFl.js";import{T as O}from"./index-BKJKY9Wv.js";import{F as x}from"./Flex-Bz2InqMs.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-DGmZero8.js";import"./Button-Dkbd3KcU.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./clsx-B-dksMZM.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useFocusable-BwFERnd_.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useFocusRing-COnCKKka.js";import"./RSPContexts-BdpIjeVF.js";import"./OverlayArrow-CcKR7RW9.js";import"./useControlledState-DzBnLbpE.js";import"./SelectionManager-AOhnTTKk.js";import"./useEvent-BRbGx-1q.js";import"./SelectionIndicator-yhlvspp_.js";import"./Separator-CPZLX6dD.js";import"./Text-B7PuQZMK.js";import"./useLocalizedStringFormatter-C4c9cZU5.js";import"./animation-D5pTcXzL.js";import"./VisuallyHidden-BvkZfodz.js";import"./FieldError-BifbfugT.js";import"./ListBox-B40TMSiq.js";import"./useListState-DtLAZGwv.js";import"./useField-BgIPqRrs.js";import"./useFormReset-DJISnqgL.js";import"./useStyles-BRwt6BXn.js";import"./Popover.module-CIIeSXYs.js";import"./Autocomplete-Ce9rXoi_.js";import"./Input-MCe13Yrn.js";import"./SearchField-DGocqKEX.js";import"./FieldLabel-Dm8Ex6MU.js";import"./FieldError-Dr6Rp0Rr.js";import"./useSurface-CJaN3YoD.js";const e=j.meta({title:"Backstage UI/Select",component:w,args:{style:{width:300}}}),R=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],z=[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"mx",label:"Mexico"},{value:"uk",label:"United Kingdom"},{value:"fr",label:"France"},{value:"de",label:"Germany"},{value:"it",label:"Italy"},{value:"es",label:"Spain"},{value:"jp",label:"Japan"},{value:"cn",label:"China"},{value:"in",label:"India"},{value:"br",label:"Brazil"},{value:"au",label:"Australia"}],B=[{value:"react",label:"React"},{value:"typescript",label:"TypeScript"},{value:"javascript",label:"JavaScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"kotlin",label:"Kotlin"},{value:"swift",label:"Swift"}],r=e.story({args:{options:R,name:"font"}}),l=e.story({args:{label:"Country",searchable:!0,searchPlaceholder:"Search countries...",options:z}}),c=e.story({args:{label:"Select multiple options",selectionMode:"multiple",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"}]}}),p=e.story({args:{label:"Skills",searchable:!0,selectionMode:"multiple",searchPlaceholder:"Filter skills...",options:B}}),n=e.story({args:{label:"Font Family",options:R,placeholder:"Select a font",name:"font",style:{maxWidth:260}}}),i=e.story({args:{...r.input.args,label:"Font Family"}}),u=e.story({args:{...r.input.args,label:"Font Family",style:{width:"100%"}}}),d=e.story({args:{...i.input.args,description:"Choose a font family for your document"}}),m=e.story({args:{...i.input.args},render:a=>t.jsx(w,{...a,icon:t.jsx(O,{})})}),g=e.story({args:{...n.input.args},render:a=>t.jsxs(x,{direction:"row",gap:"2",children:[t.jsx(w,{...a,size:"small",icon:t.jsx(O,{})}),t.jsx(w,{...a,size:"medium",icon:t.jsx(O,{})})]})}),h=e.story({args:{...n.input.args,isRequired:!0}}),y=e.story({args:{...n.input.args,isDisabled:!0}}),S=e.story({args:{...n.input.args,disabledKeys:["cursive","serif"]}}),f=e.story({args:{...n.input.args,options:void 0}}),b=e.story({args:{...n.input.args,selectedKey:"mono",defaultSelectedKey:"serif"}}),v=e.story({args:{...n.input.args,defaultSelectedKey:"serif",options:R,name:"font"}}),G=(a=100)=>{const D=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],T=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],I=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],W=o=>o[Math.floor(Math.random()*o.length)],L=Array.from({length:a}).map(()=>{const o=W(D),M=W(T),k=W(I);return`${o}${M} ${k}`}).reduce((o,M)=>(o.add(M),o),new Set).values();return Array.from(L).map(o=>({value:o.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:o}))},P=e.story({args:{label:"Font Family",options:G(),name:"font"}}),F=e.story({args:{...i.input.args,name:"font"},render:a=>t.jsx(E,{validationErrors:{font:"Invalid font family"},children:t.jsx(w,{...a})})}),s=e.story({args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}}),C=e.story({args:{...s.input.args},decorators:[(a,{args:D})=>t.jsx("div",{style:{padding:128},children:t.jsx(a,{...D})})]}),A=e.story({args:{...r.input.args},render:a=>t.jsxs(x,{direction:"column",gap:"4",children:[t.jsxs("div",{children:[t.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),t.jsx(w,{...a,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),t.jsxs("div",{children:[t.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),t.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),t.jsx(w,{...a,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => (
  <Select style={{ width: 300 }} options={fontOptions} name="font" />
);
`,...r.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const Searchable = () => (
  <Select
    style={{ width: 300 }}
    label="Country"
    searchable
    searchPlaceholder="Search countries..."
    options={countries}
  />
);
`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const MultipleSelection = () => (
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
`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const SearchableMultiple = () => (
  <Select
    style={{ width: 300 }}
    label="Skills"
    searchable
    selectionMode="multiple"
    searchPlaceholder="Filter skills..."
    options={skills}
  />
);
`,...p.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Preview = () => (
  <Select
    style={{ maxWidth: 260 }}
    label="Font Family"
    options={fontOptions}
    placeholder="Select a font"
    name="font"
  />
);
`,...n.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const WithLabel = () => <Select style={{ width: 300 }} label="Font Family" />;
`,...i.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const WithFullWidth = () => (
  <Select style={{ width: "100%" }} label="Font Family" />
);
`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const WithLabelAndDescription = () => (
  <Select
    style={{ width: 300 }}
    description="Choose a font family for your document"
  />
);
`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const WithIcon = () => <Select style={{ width: 300 }} icon={<RiCloudLine />} />;
`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="2">
    <Select style={{ width: 300 }} size="small" icon={<RiCloudLine />} />
    <Select style={{ width: 300 }} size="medium" icon={<RiCloudLine />} />
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const Required = () => <Select style={{ width: 300 }} isRequired />;
`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const Disabled = () => <Select style={{ width: 300 }} isDisabled />;
`,...y.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{code:`const DisabledOption = () => (
  <Select style={{ width: 300 }} disabledKeys={["cursive", "serif"]} />
);
`,...S.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{code:`const NoOptions = () => <Select style={{ width: 300 }} options={undefined} />;
`,...f.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const WithValue = () => (
  <Select
    style={{ width: 300 }}
    selectedKey="mono"
    defaultSelectedKey="serif"
  />
);
`,...b.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const WithDefaultValue = () => (
  <Select
    style={{ width: 300 }}
    defaultSelectedKey="serif"
    options={fontOptions}
    name="font"
  />
);
`,...v.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{code:`const WithManyOptions = () => (
  <Select
    style={{ width: 300 }}
    label="Font Family"
    options={generateOptions()}
    name="font"
  />
);
`,...P.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{code:`const WithError = () => (
  <Form validationErrors={{ font: "Invalid font family" }}>
    <Select style={{ width: 300 }} name="font" />
  </Form>
);
`,...F.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const WithLongNames = () => (
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
`,...s.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{code:`const WithLongNamesAndPadding = () => <Select style={{ width: 300 }} />;
`,...C.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{code:`const WithAccessibilityProps = () => (
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
`,...A.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    options: fontOptions,
    name: 'font'
  }
})`,...r.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Country',
    searchable: true,
    searchPlaceholder: 'Search countries...',
    options: countries
  }
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Skills',
    searchable: true,
    selectionMode: 'multiple',
    searchPlaceholder: 'Filter skills...',
    options: skills
  }
})`,...p.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: {
      maxWidth: 260
    }
  }
})`,...n.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family'
  }
})`,...i.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
})`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document'
  }
})`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isRequired: true
  }
})`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true
  }
})`,...y.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif']
  }
})`,...S.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    options: undefined
  }
})`,...f.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif'
  }
})`,...b.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
})`,...v.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
})`,...P.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
})`,...F.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...A.input.parameters?.docs?.source}}};const xe=["Default","Searchable","MultipleSelection","SearchableMultiple","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","WithAccessibilityProps"];export{r as Default,y as Disabled,S as DisabledOption,c as MultipleSelection,f as NoOptions,n as Preview,h as Required,l as Searchable,p as SearchableMultiple,g as Sizes,A as WithAccessibilityProps,v as WithDefaultValue,F as WithError,u as WithFullWidth,m as WithIcon,i as WithLabel,d as WithLabelAndDescription,s as WithLongNames,C as WithLongNamesAndPadding,P as WithManyOptions,b as WithValue,xe as __namedExportsOrder};
