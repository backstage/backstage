import{j as e,B as l,p as E}from"./iframe-D4ojcRBn.js";import{S as i}from"./Select-B2iLoFOo.js";import{$ as z}from"./useFormValidation-QY3_JajN.js";import{T as B}from"./index-wUV5n3Lj.js";import{F as p}from"./Flex-CXbgynOo.js";import{T as R}from"./Text-CQr1Uda4.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-CJRFIS4q.js";import"./Button-DsW7Brbl.js";import"./utils-Cm3b7Skj.js";import"./useObjectRef-DkO8wYK8.js";import"./Label-CB4WGRMe.js";import"./Hidden-DqoOPxZG.js";import"./useGlobalListeners-Gjlq1Nm8.js";import"./openLink-Dgpda5ne.js";import"./useLabel-Bpz-kngj.js";import"./useLabels-Bymz_Bk2.js";import"./number-BMwxkJ1f.js";import"./I18nProvider-DcSF5323.js";import"./useButton-Ds76GMuS.js";import"./usePress-C2Xo5NR5.js";import"./textSelection-D1kZvdOs.js";import"./useHover-BrnPNTQ_.js";import"./Heading-BNWcgXFS.js";import"./useOverlayTriggerState-KefCD6yL.js";import"./useControlledState-DLb6xbqZ.js";import"./useCollection-BOJ37AYD.js";import"./keyboard-CWbYtSBH.js";import"./FocusScope-CtR-NYVZ.js";import"./useEvent-Bo_Ag7Ze.js";import"./Autocomplete-ZvIpyd9g.js";import"./useLocalizedStringFormatter-CxWeQ8ll.js";import"./getItemCount-Bdc0HNtk.js";import"./Text-CeBFKxbr.js";import"./VisuallyHidden-ZFnIyy2e.js";import"./animation-BMMFchtM.js";import"./FieldError-D1tnYwiC.js";import"./ListBox-UjmNzPiw.js";import"./useListState-CLNtscvB.js";import"./useField-DTRRMUNK.js";import"./useFormReset-vk-N9tAs.js";import"./definition-Cdl3um0c.js";import"./Input-B3C67cIY.js";import"./SearchField-7oyAcyDD.js";import"./useTextField-DuhpfueG.js";import"./useFilter-DB-RcLD6.js";import"./FieldLabel-CI9K53U2.js";import"./FieldError-yJqEjFdo.js";const t=E.meta({title:"Backstage UI/Select",component:i,args:{style:{width:300}}}),c=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],G=[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"mx",label:"Mexico"},{value:"uk",label:"United Kingdom"},{value:"fr",label:"France"},{value:"de",label:"Germany"},{value:"it",label:"Italy"},{value:"es",label:"Spain"},{value:"jp",label:"Japan"},{value:"cn",label:"China"},{value:"in",label:"India"},{value:"br",label:"Brazil"},{value:"au",label:"Australia"}],U=[{value:"react",label:"React"},{value:"typescript",label:"TypeScript"},{value:"javascript",label:"JavaScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"kotlin",label:"Kotlin"},{value:"swift",label:"Swift"}],o=t.story({args:{options:c,name:"font"}}),m=t.story({args:{label:"Country",searchable:!0,searchPlaceholder:"Search countries...",options:G}}),d=t.story({args:{label:"Select multiple options",selectionMode:"multiple",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"}]}}),g=t.story({args:{label:"Skills",searchable:!0,selectionMode:"multiple",searchPlaceholder:"Filter skills...",options:U}}),n=t.story({args:{label:"Font Family",options:c,placeholder:"Select a font",name:"font",style:{maxWidth:260}}}),s=t.story({args:{...o.input.args,label:"Font Family"}}),h=t.story({args:{...o.input.args,label:"Font Family",style:{width:"100%"}}}),y=t.story({args:{...s.input.args,description:"Choose a font family for your document"}}),b=t.story({args:{...s.input.args},render:a=>e.jsx(i,{...a,icon:e.jsx(B,{})})}),f=t.story({args:{...n.input.args},render:a=>e.jsxs(p,{direction:"row",gap:"2",children:[e.jsx(i,{...a,size:"small",icon:e.jsx(B,{})}),e.jsx(i,{...a,size:"medium",icon:e.jsx(B,{})})]})}),S=t.story({args:{...n.input.args,isRequired:!0}}),v=t.story({args:{...n.input.args,isDisabled:!0}}),x=t.story({args:{...n.input.args,disabledKeys:["cursive","serif"]}}),P=t.story({args:{...n.input.args,options:void 0}}),F=t.story({args:{...n.input.args,selectedKey:"mono",defaultSelectedKey:"serif"}}),A=t.story({args:{...n.input.args,defaultSelectedKey:"serif",options:c,name:"font"}}),K=(a=100)=>{const M=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],I=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],L=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],O=r=>r[Math.floor(Math.random()*r.length)],k=Array.from({length:a}).map(()=>{const r=O(M),w=O(I),N=O(L);return`${r}${w} ${N}`}).reduce((r,w)=>(r.add(w),r),new Set).values();return Array.from(k).map(r=>({value:r.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:r}))},C=t.story({args:{label:"Font Family",options:K(),name:"font"}}),W=t.story({args:{...s.input.args,name:"font"},render:a=>e.jsx(z,{validationErrors:{font:"Invalid font family"},children:e.jsx(i,{...a})})}),u=t.story({args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}}),D=t.story({args:{...u.input.args},decorators:[(a,{args:M})=>e.jsx("div",{style:{padding:128},children:e.jsx(a,{...M})})]}),j=t.story({render:()=>e.jsxs(p,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Select automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(R,{children:"Neutral 1 container"}),e.jsx(p,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{options:c,"aria-label":"Font family"})})]}),e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(R,{children:"Neutral 2 container"}),e.jsx(p,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{options:c,"aria-label":"Font family"})})]})}),e.jsx(l,{bg:"neutral",children:e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(R,{children:"Neutral 3 container"}),e.jsx(p,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{options:c,"aria-label":"Font family"})})]})})})]})}),T=t.story({args:{...o.input.args},render:a=>e.jsxs(p,{direction:"column",gap:"4",children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),e.jsx(i,{...a,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),e.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),e.jsx(i,{...a,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    options: fontOptions,
    name: 'font'
  }
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Country',
    searchable: true,
    searchPlaceholder: 'Search countries...',
    options: countries
  }
})`,...m.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Skills',
    searchable: true,
    selectionMode: 'multiple',
    searchPlaceholder: 'Filter skills...',
    options: skills
  }
})`,...g.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: {
      maxWidth: 260
    }
  }
})`,...n.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family'
  }
})`,...s.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
})`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document'
  }
})`,...y.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
})`,...b.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
})`,...f.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isRequired: true
  }
})`,...S.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true
  }
})`,...v.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif']
  }
})`,...x.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    options: undefined
  }
})`,...P.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif'
  }
})`,...F.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
})`,...A.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
})`,...C.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
})`,...W.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...D.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};const Ne=["Default","Searchable","MultipleSelection","SearchableMultiple","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","AutoBg","WithAccessibilityProps"];export{j as AutoBg,o as Default,v as Disabled,x as DisabledOption,d as MultipleSelection,P as NoOptions,n as Preview,S as Required,m as Searchable,g as SearchableMultiple,f as Sizes,T as WithAccessibilityProps,A as WithDefaultValue,W as WithError,h as WithFullWidth,b as WithIcon,s as WithLabel,y as WithLabelAndDescription,u as WithLongNames,D as WithLongNamesAndPadding,C as WithManyOptions,F as WithValue,Ne as __namedExportsOrder};
