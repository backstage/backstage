import{j as e}from"./iframe-CA0Xqitl.js";import{S as s}from"./Select-BfoN-UQg.js";import{$ as k}from"./Form-DGLvPRKd.js";import{T as M}from"./index-Uz4cXNx-.js";import{F as w}from"./Flex-UeRHtQGJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-Cn-0xqtN.js";import"./ListBox-_72JCLRl.js";import"./useListState-Q9qtHDPM.js";import"./useFocusable-B_K0Toxg.js";import"./useObjectRef-galIu8y9.js";import"./clsx-B-dksMZM.js";import"./usePress-Cm_6NlmW.js";import"./useEvent-CkLerqy-.js";import"./SelectionIndicator-CeeANDjU.js";import"./context-C_kA5pZC.js";import"./Hidden-DiEvt5li.js";import"./useControlledState-8zGhBtdn.js";import"./utils-CxRSQOHD.js";import"./RSPContexts-BkSlNiDX.js";import"./Text-B3Xw1_lZ.js";import"./useLabel-CJ64sIWi.js";import"./useLabels-DoeKqma6.js";import"./useFocusRing-XSvWfqXQ.js";import"./useLocalizedStringFormatter-BsGwSvqv.js";import"./Button-CjoOUm65.js";import"./Label-9E4Aif6g.js";import"./OverlayArrow-xGDZ1A-J.js";import"./VisuallyHidden-kH9JdjiR.js";import"./FieldError-D3jzLCkw.js";import"./useFormReset-qtnV5gzN.js";import"./useStyles-DWCTEpsL.js";import"./Input-DpxByePM.js";import"./SearchField-BCdI89FI.js";import"./FieldLabel-Fan4pOD4.js";import"./FieldError-D0PxvJJa.js";const Pe={title:"Backstage UI/Select",component:s,args:{style:{width:300}}},R=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],j=[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"mx",label:"Mexico"},{value:"uk",label:"United Kingdom"},{value:"fr",label:"France"},{value:"de",label:"Germany"},{value:"it",label:"Italy"},{value:"es",label:"Spain"},{value:"jp",label:"Japan"},{value:"cn",label:"China"},{value:"in",label:"India"},{value:"br",label:"Brazil"},{value:"au",label:"Australia"}],E=[{value:"react",label:"React"},{value:"typescript",label:"TypeScript"},{value:"javascript",label:"JavaScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"kotlin",label:"Kotlin"},{value:"swift",label:"Swift"}],t={args:{options:R,name:"font"}},l={args:{label:"Country",searchable:!0,searchPlaceholder:"Search countries...",options:j}},c={args:{label:"Select multiple options",selectionMode:"multiple",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"}]}},d={args:{label:"Skills",searchable:!0,selectionMode:"multiple",searchPlaceholder:"Filter skills...",options:E}},r={args:{label:"Font Family",options:R,placeholder:"Select a font",name:"font",style:{maxWidth:260}}},o={args:{...t.args,label:"Font Family"}},m={args:{...t.args,label:"Font Family",style:{width:"100%"}}},p={args:{...o.args,description:"Choose a font family for your document"}},u={args:{...o.args},render:a=>e.jsx(s,{...a,icon:e.jsx(M,{})})},g={args:{...r.args},render:a=>e.jsxs(w,{direction:"row",gap:"2",children:[e.jsx(s,{...a,size:"small",icon:e.jsx(M,{})}),e.jsx(s,{...a,size:"medium",icon:e.jsx(M,{})})]})},h={args:{...r.args,isRequired:!0}},f={args:{...r.args,isDisabled:!0}},b={args:{...r.args,disabledKeys:["cursive","serif"]}},S={args:{...r.args,options:void 0}},v={args:{...r.args,selectedKey:"mono",defaultSelectedKey:"serif"}},y={args:{...r.args,defaultSelectedKey:"serif",options:R,name:"font"}},z=(a=100)=>{const D=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],O=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],T=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],x=n=>n[Math.floor(Math.random()*n.length)],I=Array.from({length:a}).map(()=>{const n=x(D),W=x(O),L=x(T);return`${n}${W} ${L}`}).reduce((n,W)=>(n.add(W),n),new Set).values();return Array.from(I).map(n=>({value:n.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:n}))},P={args:{label:"Font Family",options:z(),name:"font"}},C={args:{...o.args,name:"font"},render:a=>e.jsx(k,{validationErrors:{font:"Invalid font family"},children:e.jsx(s,{...a})})},i={args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}},F={args:{...i.args},decorators:[(a,{args:D})=>e.jsx("div",{style:{padding:128},children:e.jsx(a,{...D})})]},A={args:{...t.args},render:a=>e.jsxs(w,{direction:"column",gap:"4",children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),e.jsx(s,{...a,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),e.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),e.jsx(s,{...a,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    options: fontOptions,
    name: 'font'
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    searchable: true,
    searchPlaceholder: 'Search countries...',
    options: countries
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skills',
    searchable: true,
    selectionMode: 'multiple',
    searchPlaceholder: 'Filter skills...',
    options: skills
  }
}`,...d.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: {
      maxWidth: 260
    }
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Font Family'
  }
}`,...o.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Choose a font family for your document'
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    isRequired: true
  }
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    isDisabled: true
  }
}`,...f.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    disabledKeys: ['cursive', 'serif']
  }
}`,...b.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    options: undefined
  }
}`,...S.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif'
  }
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
}`,...y.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
}`,...P.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
}`,...C.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLongNames.args
  },
  decorators: [(Story, {
    args
  }) => <div style={{
    padding: 128
  }}>
        <Story {...args} />
      </div>]
}`,...F.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
}`,...A.parameters?.docs?.source}}};const Ce=["Default","Searchable","MultipleSelection","SearchableMultiple","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","WithAccessibilityProps"];export{t as Default,f as Disabled,b as DisabledOption,c as MultipleSelection,S as NoOptions,r as Preview,h as Required,l as Searchable,d as SearchableMultiple,g as Sizes,A as WithAccessibilityProps,y as WithDefaultValue,C as WithError,m as WithFullWidth,u as WithIcon,o as WithLabel,p as WithLabelAndDescription,i as WithLongNames,F as WithLongNamesAndPadding,P as WithManyOptions,v as WithValue,Ce as __namedExportsOrder,Pe as default};
