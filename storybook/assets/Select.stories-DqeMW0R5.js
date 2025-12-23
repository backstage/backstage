import{a3 as j,j as t}from"./iframe-Hw755TNi.js";import{S as s}from"./Select-CzhYYSSn.js";import{$ as E}from"./Form-CUIRz8F1.js";import{T as w}from"./index-DEcR4k_l.js";import{F as O}from"./Flex-qn2HiTG0.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-BTjN8Hq3.js";import"./ListBox-COfha5-X.js";import"./useListState-D8JghFOT.js";import"./useFocusable-m4FGHcow.js";import"./useObjectRef-Cc5_Ey3_.js";import"./clsx-B-dksMZM.js";import"./usePress-BD667nug.js";import"./useEvent-B8Xs39KX.js";import"./SelectionIndicator-2vRnNvSY.js";import"./context-BGVznzgA.js";import"./Hidden-Dbya7mrA.js";import"./useControlledState-BXR-fBbB.js";import"./utils-BUVUUeFt.js";import"./RSPContexts-8F24Wau_.js";import"./Text-BJjUO6R9.js";import"./useLabel-NzZqVTci.js";import"./useLabels-Cj-GaSS9.js";import"./useFocusRing-B7_LwlYY.js";import"./useLocalizedStringFormatter-CQ5iz0hS.js";import"./Button-DwgHingZ.js";import"./Label-CorDF3tZ.js";import"./OverlayArrow-CF5CoDT9.js";import"./VisuallyHidden-4pe7iIK4.js";import"./FieldError-aOIswKl9.js";import"./useFormReset-BAJhHFtg.js";import"./useStyles-B00qSMeS.js";import"./Input-DUNqwJ3W.js";import"./SearchField-Br7esYFm.js";import"./FieldLabel-CW1FdPFl.js";import"./FieldError-CthxFkzO.js";const e=j.meta({title:"Backstage UI/Select",component:s,args:{style:{width:300}}}),R=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],z=[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"mx",label:"Mexico"},{value:"uk",label:"United Kingdom"},{value:"fr",label:"France"},{value:"de",label:"Germany"},{value:"it",label:"Italy"},{value:"es",label:"Spain"},{value:"jp",label:"Japan"},{value:"cn",label:"China"},{value:"in",label:"India"},{value:"br",label:"Brazil"},{value:"au",label:"Australia"}],B=[{value:"react",label:"React"},{value:"typescript",label:"TypeScript"},{value:"javascript",label:"JavaScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"kotlin",label:"Kotlin"},{value:"swift",label:"Swift"}],i=e.story({args:{options:R,name:"font"}}),c=e.story({args:{label:"Country",searchable:!0,searchPlaceholder:"Search countries...",options:z}}),p=e.story({args:{label:"Select multiple options",selectionMode:"multiple",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"}]}}),u=e.story({args:{label:"Skills",searchable:!0,selectionMode:"multiple",searchPlaceholder:"Filter skills...",options:B}}),n=e.story({args:{label:"Font Family",options:R,placeholder:"Select a font",name:"font",style:{maxWidth:260}}}),o=e.story({args:{...i.input.args,label:"Font Family"}}),m=e.story({args:{...i.input.args,label:"Font Family",style:{width:"100%"}}}),d=e.story({args:{...o.input.args,description:"Choose a font family for your document"}}),g=e.story({args:{...o.input.args},render:a=>t.jsx(s,{...a,icon:t.jsx(w,{})})}),h=e.story({args:{...n.input.args},render:a=>t.jsxs(O,{direction:"row",gap:"2",children:[t.jsx(s,{...a,size:"small",icon:t.jsx(w,{})}),t.jsx(s,{...a,size:"medium",icon:t.jsx(w,{})})]})}),y=e.story({args:{...n.input.args,isRequired:!0}}),f=e.story({args:{...n.input.args,isDisabled:!0}}),b=e.story({args:{...n.input.args,disabledKeys:["cursive","serif"]}}),S=e.story({args:{...n.input.args,options:void 0}}),v=e.story({args:{...n.input.args,selectedKey:"mono",defaultSelectedKey:"serif"}}),P=e.story({args:{...n.input.args,defaultSelectedKey:"serif",options:R,name:"font"}}),N=(a=100)=>{const x=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],T=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],I=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],W=r=>r[Math.floor(Math.random()*r.length)],L=Array.from({length:a}).map(()=>{const r=W(x),M=W(T),k=W(I);return`${r}${M} ${k}`}).reduce((r,M)=>(r.add(M),r),new Set).values();return Array.from(L).map(r=>({value:r.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:r}))},C=e.story({args:{label:"Font Family",options:N(),name:"font"}}),F=e.story({args:{...o.input.args,name:"font"},render:a=>t.jsx(E,{validationErrors:{font:"Invalid font family"},children:t.jsx(s,{...a})})}),l=e.story({args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}}),A=e.story({args:{...l.input.args},decorators:[(a,{args:x})=>t.jsx("div",{style:{padding:128},children:t.jsx(a,{...x})})]}),D=e.story({args:{...i.input.args},render:a=>t.jsxs(O,{direction:"column",gap:"4",children:[t.jsxs("div",{children:[t.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),t.jsx(s,{...a,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),t.jsxs("div",{children:[t.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),t.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),t.jsx(s,{...a,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    options: fontOptions,
    name: 'font'
  }
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
})`,...m.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document'
  }
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true
  }
})`,...f.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif']
  }
})`,...b.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
})`,...P.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
})`,...C.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
})`,...F.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...A.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...D.input.parameters?.docs?.source}}};const Fe=["Default","Searchable","MultipleSelection","SearchableMultiple","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","WithAccessibilityProps"];export{i as Default,f as Disabled,b as DisabledOption,p as MultipleSelection,S as NoOptions,n as Preview,y as Required,c as Searchable,u as SearchableMultiple,h as Sizes,D as WithAccessibilityProps,P as WithDefaultValue,F as WithError,m as WithFullWidth,g as WithIcon,o as WithLabel,d as WithLabelAndDescription,l as WithLongNames,A as WithLongNamesAndPadding,C as WithManyOptions,v as WithValue,Fe as __namedExportsOrder};
