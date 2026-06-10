import{bR as e,i as l,c7 as U}from"./iframe-C0kJxuo3.js";import{S as o}from"./Select-DZJVc9sT.js";import{a as K}from"./useFormValidation-3aKGROn2.js";import{T as L}from"./index-Coy0BsT2.js";import{F as c}from"./Flex-C5LS31Mv.js";import{T as I}from"./Text-BuUWsI-Z.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-aj67Y2P6.js";import"./Button-0xD_iNZ8.js";import"./utils-CnFsvhU-.js";import"./useObjectRef-BSMvvO9T.js";import"./Label-CdCEFadA.js";import"./Hidden-CHyqgnK5.js";import"./useFocusRing-Bg7HxPV-.js";import"./openLink-DDhi7ntb.js";import"./useLabel-DNf3_Lp_.js";import"./useLabels-4ReBYVqS.js";import"./number-Dmbrky01.js";import"./I18nProvider-CQJu78Ur.js";import"./useButton-C5_iIfVg.js";import"./usePress-D6IwwG3Z.js";import"./textSelection-CBV5UGO_.js";import"./useHover-D7zQG8_9.js";import"./Heading-C3ekKbn_.js";import"./useOverlayTriggerState-DNfzgjNB.js";import"./useControlledState-DQVnvmLX.js";import"./useCollection-DfuSg4vH.js";import"./keyboard-BnyidUqB.js";import"./FocusScope-787iYxHM.js";import"./useEvent-DBd9MG6t.js";import"./Autocomplete-DeDZ3wSY.js";import"./useLocalizedStringFormatter-CaA0b4kd.js";import"./getItemCount-s1EPoKYf.js";import"./Text-Ct_pvziQ.js";import"./VisuallyHidden-B3qXyhFS.js";import"./animation-BE1K-jNr.js";import"./FieldError--FqYVBj6.js";import"./ListBox-DBzdgmOG.js";import"./useListState-BDTgDPEL.js";import"./useField-BpTsyISE.js";import"./useFormReset-C1xWZBqw.js";import"./definition-DKxva3wU.js";import"./Input-B_FaaR_5.js";import"./SearchField-BajbnPLQ.js";import"./useTextField-DIqeoBkH.js";import"./useFilter-DDvz2G1_.js";import"./FieldLabel-BCoc0pgd.js";import"./FieldError-tphVtU6h.js";const t=U.meta({title:"Backstage UI/Select",component:o,args:{style:{width:300}}}),p=[{value:"sans",label:"Sans-serif"},{value:"serif",label:"Serif"},{value:"mono",label:"Monospace"},{value:"cursive",label:"Cursive"}],q=[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"mx",label:"Mexico"},{value:"uk",label:"United Kingdom"},{value:"fr",label:"France"},{value:"de",label:"Germany"},{value:"it",label:"Italy"},{value:"es",label:"Spain"},{value:"jp",label:"Japan"},{value:"cn",label:"China"},{value:"in",label:"India"},{value:"br",label:"Brazil"},{value:"au",label:"Australia"}],V=[{value:"react",label:"React"},{value:"typescript",label:"TypeScript"},{value:"javascript",label:"JavaScript"},{value:"python",label:"Python"},{value:"java",label:"Java"},{value:"csharp",label:"C#"},{value:"go",label:"Go"},{value:"rust",label:"Rust"},{value:"kotlin",label:"Kotlin"},{value:"swift",label:"Swift"}],i=t.story({args:{options:p,name:"font"}}),m=t.story({args:{label:"Country",searchable:!0,searchPlaceholder:"Search countries...",options:q}}),d=t.story({args:{label:"Select multiple options",selectionMode:"multiple",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4"}]}}),g=t.story({args:{label:"Skills",searchable:!0,selectionMode:"multiple",searchPlaceholder:"Filter skills...",options:V}}),k=[{title:"Serif Fonts",options:[{value:"times",label:"Times New Roman"},{value:"georgia",label:"Georgia"},{value:"garamond",label:"Garamond"}]},{title:"Sans-Serif Fonts",options:[{value:"arial",label:"Arial"},{value:"helvetica",label:"Helvetica"},{value:"verdana",label:"Verdana"}]},{title:"Monospace Fonts",options:[{value:"courier",label:"Courier New"},{value:"consolas",label:"Consolas"},{value:"fira",label:"Fira Code"}]}],h=t.story({args:{label:"Font Family",options:k,name:"font"}}),y=t.story({args:{label:"Font Family",searchable:!0,searchPlaceholder:"Search fonts...",options:k,name:"font"}}),n=t.story({args:{label:"Font Family",options:p,placeholder:"Select a font",name:"font",style:{maxWidth:260}}}),s=t.story({args:{...i.input.args,label:"Font Family"}}),b=t.story({args:{...i.input.args,label:"Font Family",style:{width:"100%"}}}),f=t.story({args:{...s.input.args,description:"Choose a font family for your document"}}),S=t.story({args:{...s.input.args},render:a=>e.jsx(o,{...a,icon:e.jsx(L,{})})}),v=t.story({args:{...n.input.args},render:a=>e.jsxs(c,{direction:"row",gap:"2",children:[e.jsx(o,{...a,size:"small",icon:e.jsx(L,{})}),e.jsx(o,{...a,size:"medium",icon:e.jsx(L,{})})]})}),x=t.story({args:{...n.input.args,isRequired:!0}}),F=t.story({args:{...n.input.args,isDisabled:!0}}),P=t.story({args:{...n.input.args,disabledKeys:["cursive","serif"]}}),C=t.story({args:{...n.input.args,options:void 0}}),W=t.story({args:{...n.input.args,selectedKey:"mono",defaultSelectedKey:"serif"}}),A=t.story({args:{...n.input.args,defaultSelectedKey:"serif",options:p,name:"font"}}),Q=(a=100)=>{const w=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],N=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],E=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],R=r=>r[Math.floor(Math.random()*r.length)],z=Array.from({length:a}).map(()=>{const r=R(w),B=R(N),G=R(E);return`${r}${B} ${G}`}).reduce((r,B)=>(r.add(B),r),new Set).values();return Array.from(z).map(r=>({value:r.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:r}))},D=t.story({args:{label:"Font Family",options:Q(),name:"font"}}),T=t.story({args:{...s.input.args,name:"font"},render:a=>e.jsx(K,{validationErrors:{font:"Invalid font family"},children:e.jsx(o,{...a})})}),u=t.story({args:{label:"Document Template",options:[{value:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{value:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{value:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{value:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{value:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultSelectedKey:"annual-report-2024"}}),j=t.story({args:{...u.input.args},decorators:[(a,{args:w})=>e.jsx("div",{style:{padding:128},children:e.jsx(a,{...w})})]}),M=t.story({render:()=>e.jsxs(c,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Select automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(I,{children:"Neutral 1 container"}),e.jsx(c,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(o,{options:p,"aria-label":"Font family"})})]}),e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(I,{children:"Neutral 2 container"}),e.jsx(c,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(o,{options:p,"aria-label":"Font family"})})]})}),e.jsx(l,{bg:"neutral",children:e.jsx(l,{bg:"neutral",children:e.jsxs(l,{bg:"neutral",p:"4",children:[e.jsx(I,{children:"Neutral 3 container"}),e.jsx(c,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(o,{options:p,"aria-label":"Font family"})})]})})})]})}),O=t.story({args:{...i.input.args},render:a=>e.jsxs(c,{direction:"column",gap:"4",children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),e.jsx(o,{...a,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),e.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),e.jsx(o,{...a,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    options: fontOptions,
    name: 'font'
  }
})`,...i.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: sectionedOptions,
    name: 'font'
  }
})`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    searchable: true,
    searchPlaceholder: 'Search fonts...',
    options: sectionedOptions,
    name: 'font'
  }
})`,...y.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
})`,...b.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document'
  }
})`,...f.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
})`,...S.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
})`,...v.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isRequired: true
  }
})`,...x.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true
  }
})`,...F.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif']
  }
})`,...P.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    options: undefined
  }
})`,...C.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif'
  }
})`,...W.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font'
  }
})`,...A.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
})`,...D.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
})`,...T.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...M.input.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...O.input.parameters?.docs?.source}}};const Ge=["Default","Searchable","MultipleSelection","SearchableMultiple","WithSections","SearchableWithSections","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","AutoBg","WithAccessibilityProps"];export{M as AutoBg,i as Default,F as Disabled,P as DisabledOption,d as MultipleSelection,C as NoOptions,n as Preview,x as Required,m as Searchable,g as SearchableMultiple,y as SearchableWithSections,v as Sizes,O as WithAccessibilityProps,A as WithDefaultValue,T as WithError,b as WithFullWidth,S as WithIcon,s as WithLabel,f as WithLabelAndDescription,u as WithLongNames,j as WithLongNamesAndPadding,D as WithManyOptions,h as WithSections,W as WithValue,Ge as __namedExportsOrder};
