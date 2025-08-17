import{j as e}from"./jsx-runtime-hv06LKfz.js";import{S as i}from"./Select-BlEAeDGs.js";import{F as x}from"./Flex-CoduicHc.js";import{$ as M}from"./FieldError-Bv1neE71.js";import{T as D}from"./provider-DYpvHhpv.js";import"./index-D8-PC79C.js";import"./Button-DjvYHEK_.js";import"./utils-SVxEJA3c.js";import"./clsx-B-dksMZM.js";import"./Hidden-Bl3CD3Sw.js";import"./useFocusRing-CSBfGNH9.js";import"./usePress-C0W0oizE.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./Collection-C6PdQmfC.js";import"./FocusScope-CQlMwp1s.js";import"./context-C8UuisDZ.js";import"./useControlledState-hFzvQclK.js";import"./Input-BdpedIEL.js";import"./useFormReset-JKupIHyW.js";import"./SearchField-CXr1fdwq.js";import"./Label-x6hg8m87.js";import"./TextField-Cy-x5SL9.js";import"./useLabels-CXdioV2U.js";import"./OverlayArrow-jSjk85tW.js";import"./VisuallyHidden-C9OzMNB-.js";import"./useStyles-DaPhFVFa.js";import"./FieldLabel-5PdQNUsa.js";import"./spacing.props-m9PQeFPu.js";const le={title:"Backstage UI/Select",component:i},F=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],s={args:{options:F,name:"font"}},a={args:{label:"Font Family",options:F,placeholder:"Select a font",name:"font",style:{maxWidth:260}}},t={args:{...s.args,label:"Font Family"}},l={args:{...s.args,label:"Font Family",style:{width:"100%"}}},c={args:{...t.args,description:"Choose a font family for your document"}},d={args:{...t.args},render:r=>e.jsx(i,{...r,icon:e.jsx(D,{})})},m={args:{...a.args},render:r=>e.jsxs(x,{direction:"row",gap:"2",children:[e.jsx(i,{...r,size:"small",icon:e.jsx(D,{})}),e.jsx(i,{...r,size:"medium",icon:e.jsx(D,{})})]})},p={args:{...a.args,isRequired:!0}},u={args:{...a.args,isDisabled:!0}},g={args:{...a.args,disabledKeys:["cursive","serif"]}},f={args:{...a.args,options:void 0}},h={args:{...a.args,selectedKey:"mono",defaultSelectedKey:"serif"}},S={args:{...a.args,defaultSelectedKey:"serif",options:F,name:"font"}},L=(r=100)=>{const b=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],W=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],R=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],A=n=>n[Math.floor(Math.random()*n.length)],T=Array.from({length:r}).map(()=>{const n=A(b),C=A(W),w=A(R);return`${n}${C} ${w}`}).reduce((n,C)=>(n.add(C),n),new Set).values();return Array.from(T).map(n=>({value:n.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:n}))},v={args:{label:"Font Family",options:L(),name:"font"}},y={args:{...t.args,name:"font"},render:r=>e.jsx(M,{validationErrors:{font:"Invalid font family"},children:e.jsx(i,{...r})})},o={args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}},P={args:{...o.args},decorators:[(r,{args:b})=>e.jsx("div",{style:{padding:128},children:e.jsx(r,{...b})})]};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    options: fontOptions,
    name: 'font'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: {
      maxWidth: 260
    }
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Font Family'
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    options: undefined
  }
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif'
  }
}`,...h.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    ...Preview.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
}`,...S.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
}`,...y.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};const ce=["Default","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding"];export{s as Default,u as Disabled,g as DisabledOption,f as NoOptions,a as Preview,p as Required,m as Sizes,S as WithDefaultValue,y as WithError,l as WithFullWidth,d as WithIcon,t as WithLabel,c as WithLabelAndDescription,o as WithLongNames,P as WithLongNamesAndPadding,v as WithManyOptions,h as WithValue,ce as __namedExportsOrder,le as default};
