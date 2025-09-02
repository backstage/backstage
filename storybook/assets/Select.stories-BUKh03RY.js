import{j as e}from"./jsx-runtime-hv06LKfz.js";import{S as s}from"./Select-D8aWg-w4.js";import{F as x}from"./Flex-C_LlPGvM.js";import{$ as L}from"./FieldError-1gSpcCTl.js";import{T as D}from"./provider-C6Ma5UVL.js";import"./index-D8-PC79C.js";import"./Button-U0_f04OL.js";import"./utils-SVxEJA3c.js";import"./clsx-B-dksMZM.js";import"./Hidden-Bl3CD3Sw.js";import"./useFocusRing-CSBfGNH9.js";import"./usePress-BiO5y4q0.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./Collection-ep6p65Wv.js";import"./FocusScope-8zIF1xgC.js";import"./context-C8UuisDZ.js";import"./useControlledState-hFzvQclK.js";import"./Input-DmMKXuNi.js";import"./useFormReset-JKupIHyW.js";import"./SearchField-5B6KmH8T.js";import"./Label-x6hg8m87.js";import"./TextField-BWVKLr9c.js";import"./useLabels-CXdioV2U.js";import"./OverlayArrow-DE7RRCpW.js";import"./VisuallyHidden-C9OzMNB-.js";import"./useStyles-Dc-DqJ_c.js";import"./FieldLabel-Bmb1Qquy.js";import"./spacing.props-m9PQeFPu.js";const ce={title:"Backstage UI/Select",component:s},W=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],t={args:{options:W,name:"font"}},r={args:{label:"Font Family",options:W,placeholder:"Select a font",name:"font",style:{maxWidth:260}}},o={args:{...t.args,label:"Font Family"}},l={args:{...t.args,label:"Font Family",style:{width:"100%"}}},c={args:{...o.args,description:"Choose a font family for your document"}},d={args:{...o.args},render:a=>e.jsx(s,{...a,icon:e.jsx(D,{})})},m={args:{...r.args},render:a=>e.jsxs(x,{direction:"row",gap:"2",children:[e.jsx(s,{...a,size:"small",icon:e.jsx(D,{})}),e.jsx(s,{...a,size:"medium",icon:e.jsx(D,{})})]})},p={args:{...r.args,isRequired:!0}},u={args:{...r.args,isDisabled:!0}},g={args:{...r.args,disabledKeys:["cursive","serif"]}},h={args:{...r.args,options:void 0}},f={args:{...r.args,selectedKey:"mono",defaultSelectedKey:"serif"}},S={args:{...r.args,defaultSelectedKey:"serif",options:W,name:"font"}},I=(a=100)=>{const A=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],R=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],T=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],F=n=>n[Math.floor(Math.random()*n.length)],w=Array.from({length:a}).map(()=>{const n=F(A),C=F(R),M=F(T);return`${n}${C} ${M}`}).reduce((n,C)=>(n.add(C),n),new Set).values();return Array.from(w).map(n=>({value:n.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:n}))},y={args:{label:"Font Family",options:I(),name:"font"}},v={args:{...o.args,name:"font"},render:a=>e.jsx(L,{validationErrors:{font:"Invalid font family"},children:e.jsx(s,{...a})})},i={args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}},b={args:{...i.args},decorators:[(a,{args:A})=>e.jsx("div",{style:{padding:128},children:e.jsx(a,{...A})})]},P={args:{...t.args},render:a=>e.jsxs(x,{direction:"column",gap:"4",children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),e.jsx(s,{...a,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),e.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),e.jsx(s,{...a,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    options: fontOptions,
    name: 'font'
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Choose a font family for your document'
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    isRequired: true
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    isDisabled: true
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    disabledKeys: ['cursive', 'serif']
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    options: undefined
  }
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif'
  }
}`,...f.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
}`,...S.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
}`,...v.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};const de=["Default","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","WithAccessibilityProps"];export{t as Default,u as Disabled,g as DisabledOption,h as NoOptions,r as Preview,p as Required,m as Sizes,P as WithAccessibilityProps,S as WithDefaultValue,v as WithError,l as WithFullWidth,d as WithIcon,o as WithLabel,c as WithLabelAndDescription,i as WithLongNames,b as WithLongNamesAndPadding,y as WithManyOptions,f as WithValue,de as __namedExportsOrder,ce as default};
