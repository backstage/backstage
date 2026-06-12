import{bR as e,i as m,c7 as re}from"./iframe-DHsLdmE0.js";import{S as i,c as p,b as K,a as $}from"./Select-Dw95ymtC.js";import{a as ie}from"./useFormValidation-p_daFSoB.js";import{$ as J}from"./useAsyncList-BefZtrO6.js";import{T as g,H}from"./index-jVoNfn90.js";import{F as l}from"./Flex-JXkMRWzt.js";import{T as s}from"./Text-z1q8J51f.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BwLA299K.js";import"./utils-DojvYQxY.js";import"./useObjectRef-BT9IXX-I.js";import"./Label-P7WFsVIs.js";import"./Hidden-BvNfuI3Q.js";import"./useFocusRing-CDFFyFJa.js";import"./openLink--DhT0IgB.js";import"./useLabel-oAlB9tb2.js";import"./useLabels-C6sZXPV2.js";import"./number-VsWsHW7o.js";import"./I18nProvider-CE3c3hhV.js";import"./useButton-Gf6Z0U4N.js";import"./usePress-CMIP055z.js";import"./textSelection-DkaXAg8-.js";import"./useHover-Bx2eQJmr.js";import"./FieldError-C41zcCX2.js";import"./Text-KiuYMpek.js";import"./ListBox-C1_ZVyUo.js";import"./useCollection-F6CQV3P0.js";import"./keyboard-DJ7vT83c.js";import"./FocusScope-5m3THCB0.js";import"./useEvent-FHg6aOMU.js";import"./useControlledState-DS1kZzJm.js";import"./getItemCount-D5gB_Ib0.js";import"./Autocomplete-D1vcVEPK.js";import"./useLocalizedStringFormatter-C9zCrUYj.js";import"./useListState-9KozNxim.js";import"./Dialog-I104NdsM.js";import"./Heading-DmWEi_Dt.js";import"./useOverlayTriggerState-BQSHZtPI.js";import"./VisuallyHidden-CoveyVzr.js";import"./animation-CZSxcoSu.js";import"./useField-Bkm1aCiA.js";import"./useFormReset-BUXbtica.js";import"./Input-BnA6Jzsp.js";import"./SearchField-B2rjMkRF.js";import"./useTextField-BA4kxORJ.js";import"./useFilter-CGdJG5lI.js";import"./useCollectionAdapter-BsxiPFNh.js";import"./Avatar-BmGiUfxg.js";import"./Skeleton-B33kMniX.js";import"./FieldLabel-C-VGD3sb.js";import"./FieldError-BTTmwhiE.js";import"./Popover-YrXke2il.js";import"./useListData-CJYJ8DE2.js";const a=re.meta({title:"Backstage UI/Select",component:i,args:{style:{width:300}}}),b=[{id:"sans",label:"Sans-serif"},{id:"serif",label:"Serif"},{id:"mono",label:"Monospace"},{id:"cursive",label:"Cursive"}],Y=[{id:"us",label:"United States"},{id:"ca",label:"Canada"},{id:"mx",label:"Mexico"},{id:"uk",label:"United Kingdom"},{id:"fr",label:"France"},{id:"de",label:"Germany"},{id:"it",label:"Italy"},{id:"es",label:"Spain"},{id:"jp",label:"Japan"},{id:"cn",label:"China"},{id:"in",label:"India"},{id:"br",label:"Brazil"},{id:"au",label:"Australia"}],oe=[{id:"react",label:"React"},{id:"typescript",label:"TypeScript"},{id:"javascript",label:"JavaScript"},{id:"python",label:"Python"},{id:"java",label:"Java"},{id:"csharp",label:"C#"},{id:"go",label:"Go"},{id:"rust",label:"Rust"},{id:"kotlin",label:"Kotlin"},{id:"swift",label:"Swift"}],h=a.story({args:{options:b,name:"font"}}),v=a.story({args:{label:"Country",search:{placeholder:"Search countries..."},options:Y}});function Q({size:t}){return e.jsxs(l,{direction:"column",gap:"4",style:{width:280},children:[e.jsx(s,{as:"div",weight:"bold",children:t==="small"?"Small":"Medium"}),e.jsxs(i,{size:t,label:"Title items",placeholder:"Select a status",style:{width:"100%"},children:[e.jsx(p,{id:"active",title:"Active"}),e.jsx(p,{id:"inactive",title:"Inactive"})]}),e.jsxs(i,{size:t,label:"Icon and title items",placeholder:"Select a deployment target",style:{width:"100%"},children:[e.jsx(p,{id:"cloud",title:"Cloud",leadingIcon:e.jsx(g,{})}),e.jsx(p,{id:"private-cloud",title:"Private cloud",leadingIcon:e.jsx(g,{})})]}),e.jsxs(i,{size:t,label:"Title and description items",placeholder:"Select a release channel",style:{width:"100%"},children:[e.jsx(p,{id:"stable",title:"Stable",description:"Recommended for production workloads"}),e.jsx(p,{id:"beta",title:"Beta",description:"Preview upcoming features"})]}),e.jsxs(i,{size:t,label:"Icon, title, and description items",placeholder:"Select a deployment target",style:{width:"100%"},children:[e.jsx(p,{id:"production-cloud",title:"Production cloud",description:"Runs production workloads",leadingIcon:e.jsx(g,{})}),e.jsx(p,{id:"staging-cloud",title:"Staging cloud",description:"Runs pre-production workloads",leadingIcon:e.jsx(g,{})})]}),e.jsxs(i,{size:t,label:"Profile items",placeholder:"Select an owner",style:{width:"100%"},children:[e.jsx(K,{id:"ada",name:"Ada Lovelace",src:"https://avatars.githubusercontent.com/u/1540635?v=4"}),e.jsx(K,{id:"grace",name:"Grace Hopper"})]}),e.jsxs(i,{size:t,label:"Custom items",placeholder:"Select a custom item",style:{width:"100%"},children:[e.jsx($,{id:"nightly",textValue:"Nightly builds",children:({isSelected:n})=>e.jsxs(l,{align:"center",justify:"between",gap:"2",children:[e.jsxs(m,{style:{flex:1},children:[e.jsx(s,{as:"div",weight:"bold",children:"Nightly builds"}),e.jsx(s,{as:"div",variant:"body-small",color:"secondary",children:"Updated every night"})]}),n&&e.jsx(H,{"aria-label":"Selected"})]})}),e.jsx($,{id:"canary",textValue:"Canary builds",children:({isSelected:n})=>e.jsxs(l,{align:"center",justify:"between",gap:"2",children:[e.jsxs(m,{style:{flex:1},children:[e.jsx(s,{as:"div",weight:"bold",children:"Canary builds"}),e.jsx(s,{as:"div",variant:"body-small",color:"secondary",children:"Updated after every merge"})]}),n&&e.jsx(H,{"aria-label":"Selected"})]})})]})]})}const j=a.story({render:()=>e.jsxs(l,{align:"start",gap:"6",children:[e.jsx(Q,{size:"small"}),e.jsx(Q,{size:"medium"})]})}),C=a.story({args:{label:"Country",search:!0,options:Y}}),Z=[{id:"ada",name:"Ada Lovelace",role:"Software Engineer"},{id:"grace",name:"Grace Hopper",role:"Computer Scientist"},{id:"margaret",name:"Margaret Hamilton",role:"Software Engineer"},{id:"katherine",name:"Katherine Johnson",role:"Mathematician"},{id:"annie",name:"Annie Easley",role:"Computer Scientist"},{id:"mary",name:"Mary Jackson",role:"Aerospace Engineer"},{id:"dorothy",name:"Dorothy Vaughan",role:"Mathematician"},{id:"radia",name:"Radia Perlman",role:"Network Engineer"},{id:"barbara",name:"Barbara Liskov",role:"Computer Scientist"},{id:"frances",name:"Frances Allen",role:"Computer Scientist"},{id:"evelyn",name:"Evelyn Boyd Granville",role:"Mathematician"},{id:"mary-keller",name:"Mary Kenneth Keller",role:"Computer Scientist"},{id:"hedy",name:"Hedy Lamarr",role:"Inventor"},{id:"joan",name:"Joan Clarke",role:"Cryptanalyst"},{id:"mary-ross",name:"Mary Golda Ross",role:"Aerospace Engineer"},{id:"ellen",name:"Ellen Ochoa",role:"Aerospace Engineer"},{id:"rebecca",name:"Rebecca Lee Crumpler",role:"Physician"},{id:"chiyome",name:"Chiyome Fukino",role:"Physician"},{id:"susan",name:"Susan Kare",role:"Designer"},{id:"mary-coombs",name:"Mary Coombs",role:"Programmer"}],se=Z.map(t=>({id:t.id,label:t.name})),_=t=>new Promise(n=>setTimeout(n,t)),X=1500,ee=5;function te({children:t}){return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:".bui-SelectList { max-height: 9rem; }"}),t]})}function le(){const t=J({async load({cursor:n,filterText:S}){await _(X);const x=S.toLocaleLowerCase(),c=se.filter(d=>d.label.toLocaleLowerCase().includes(x)),u=n?Number(n):0,r=u+ee;return{items:c.slice(u,r),cursor:r<c.length?String(r):void 0}}});return e.jsx(te,{children:e.jsx(i,{label:"Owner",placeholder:"Select an owner",options:t,search:{mode:"server",placeholder:"Search owners..."},style:{width:300}})})}const F=a.story({render:()=>e.jsx(le,{})});function ce(){const t=J({async load({cursor:n,filterText:S}){await _(X);const x=S.toLocaleLowerCase(),c=Z.filter(d=>`${d.name} ${d.role}`.toLocaleLowerCase().includes(x)),u=n?Number(n):0,r=u+ee;return{items:c.slice(u,r),cursor:r<c.length?String(r):void 0}}});return e.jsx(te,{children:e.jsx(i,{label:"Owner",placeholder:"Select an owner",items:t,search:{mode:"server",placeholder:"Search names and roles..."},style:{width:300},children:n=>e.jsxs($,{textValue:n.name,children:[e.jsx(s,{as:"div",weight:"bold",children:n.name}),e.jsx(s,{as:"div",variant:"body-small",color:"secondary",children:n.role})]})})})}const P=a.story({render:()=>e.jsx(ce,{})}),w=a.story({args:{label:"Select multiple options",selectionMode:"multiple",options:[{id:"option1",label:"Option 1"},{id:"option2",label:"Option 2"},{id:"option3",label:"Option 3"},{id:"option4",label:"Option 4"}]}}),A=a.story({args:{label:"Skills",search:{placeholder:"Filter skills..."},selectionMode:"multiple",options:oe}}),ae=[{title:"Serif Fonts",options:[{id:"times",label:"Times New Roman"},{id:"georgia",label:"Georgia"},{id:"garamond",label:"Garamond"}]},{title:"Sans-Serif Fonts",options:[{id:"arial",label:"Arial"},{id:"helvetica",label:"Helvetica"},{id:"verdana",label:"Verdana"}]},{title:"Monospace Fonts",options:[{id:"courier",label:"Courier New"},{id:"consolas",label:"Consolas"},{id:"fira",label:"Fira Code"}]}],W=a.story({args:{label:"Font Family",options:ae,name:"font"}}),I=a.story({args:{label:"Font Family",search:{placeholder:"Search fonts..."},options:ae,name:"font"}}),o=a.story({args:{label:"Font Family",options:b,placeholder:"Select a font",name:"font",style:{maxWidth:260}}}),y=a.story({args:{...h.input.args,label:"Font Family"}}),T=a.story({args:{...h.input.args,label:"Font Family",style:{width:"100%"}}}),M=a.story({args:{...y.input.args,description:"Choose a font family for your document"}}),O=a.story({args:{...y.input.args},render:t=>e.jsx(i,{...t,icon:e.jsx(g,{})})}),D=a.story({args:{...o.input.args},render:t=>e.jsxs(l,{direction:"row",gap:"2",children:[e.jsx(i,{...t,size:"small",icon:e.jsx(g,{})}),e.jsx(i,{...t,size:"medium",icon:e.jsx(g,{})})]})}),k=a.story({args:{...o.input.args,isRequired:!0}}),L=a.story({args:{...o.input.args,isDisabled:!0}}),R=a.story({args:{...o.input.args,disabledKeys:["cursive","serif"]}}),B=a.story({args:{...o.input.args,options:void 0}}),N=a.story({args:{...o.input.args,value:"mono"}}),E=a.story({args:{...o.input.args,defaultValue:"serif",options:b,name:"font"}}),de=(t=100)=>{const n=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],S=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],x=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],c=r=>r[Math.floor(Math.random()*r.length)],u=Array.from({length:t}).map(()=>{const r=c(n),d=c(S),ne=c(x);return`${r}${d} ${ne}`}).reduce((r,d)=>(r.add(d),r),new Set).values();return Array.from(u).map(r=>({id:r.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:r}))},G=a.story({args:{label:"Font Family",options:de(),name:"font"}}),V=a.story({args:{...y.input.args,name:"font"},render:t=>e.jsx(ie,{validationErrors:{font:"Invalid font family"},children:e.jsx(i,{...t})})}),f=a.story({args:{label:"Document Template",options:[{id:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{id:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{id:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{id:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{id:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultValue:"annual-report-2024"}}),z=a.story({args:{...f.input.args},decorators:[(t,{args:n})=>e.jsx("div",{style:{padding:128},children:e.jsx(t,{...n})})]}),U=a.story({render:()=>e.jsxs(l,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Select automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(m,{bg:"neutral",p:"4",children:[e.jsx(s,{children:"Neutral 1 container"}),e.jsx(l,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{options:b,"aria-label":"Font family"})})]}),e.jsx(m,{bg:"neutral",children:e.jsxs(m,{bg:"neutral",p:"4",children:[e.jsx(s,{children:"Neutral 2 container"}),e.jsx(l,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{options:b,"aria-label":"Font family"})})]})}),e.jsx(m,{bg:"neutral",children:e.jsx(m,{bg:"neutral",children:e.jsxs(m,{bg:"neutral",p:"4",children:[e.jsx(s,{children:"Neutral 3 container"}),e.jsx(l,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{options:b,"aria-label":"Font family"})})]})})})]})}),q=a.story({args:{...h.input.args},render:t=>e.jsxs(l,{direction:"column",gap:"4",children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),e.jsx(i,{...t,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),e.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),e.jsx(i,{...t,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})});h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    options: fontOptions,
    name: 'font'
  }
})`,...h.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Country',
    search: {
      placeholder: 'Search countries...'
    },
    options: countries
  }
})`,...v.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="start" gap="6">
      <SelectItemTypesColumn size="small" />
      <SelectItemTypesColumn size="medium" />
    </Flex>
})`,...j.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Country',
    search: true,
    options: countries
  }
})`,...C.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ServerBackedSelect />
})`,...F.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ServerBackedCustomSelect />
})`,...P.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Select multiple options',
    selectionMode: 'multiple',
    options: [{
      id: 'option1',
      label: 'Option 1'
    }, {
      id: 'option2',
      label: 'Option 2'
    }, {
      id: 'option3',
      label: 'Option 3'
    }, {
      id: 'option4',
      label: 'Option 4'
    }]
  }
})`,...w.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Skills',
    search: {
      placeholder: 'Filter skills...'
    },
    selectionMode: 'multiple',
    options: skills
  }
})`,...A.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: sectionedOptions,
    name: 'font'
  }
})`,...W.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    search: {
      placeholder: 'Search fonts...'
    },
    options: sectionedOptions,
    name: 'font'
  }
})`,...I.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: {
      maxWidth: 260
    }
  }
})`,...o.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family'
  }
})`,...y.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
})`,...T.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document'
  }
})`,...M.input.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
})`,...O.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
})`,...D.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isRequired: true
  }
})`,...k.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true
  }
})`,...L.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif']
  }
})`,...R.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    options: undefined
  }
})`,...B.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    value: 'mono'
  }
})`,...N.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    defaultValue: 'serif',
    options: fontOptions,
    name: 'font'
  }
})`,...E.input.parameters?.docs?.source}}};G.input.parameters={...G.input.parameters,docs:{...G.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
})`,...G.input.parameters?.docs?.source}}};V.input.parameters={...V.input.parameters,docs:{...V.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
})`,...V.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Document Template',
    options: [{
      id: 'annual-report-2024',
      label: 'Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions'
    }, {
      id: 'product-roadmap',
      label: 'Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings'
    }, {
      id: 'user-guide',
      label: 'Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions'
    }, {
      id: 'marketing-plan',
      label: 'Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology'
    }, {
      id: 'research-paper',
      label: 'Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines'
    }],
    placeholder: 'Select a document template',
    name: 'template',
    style: {
      maxWidth: 400
    },
    defaultValue: 'annual-report-2024'
  }
})`,...f.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...z.input.parameters?.docs?.source}}};U.input.parameters={...U.input.parameters,docs:{...U.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...U.input.parameters?.docs?.source}}};q.input.parameters={...q.input.parameters,docs:{...q.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...q.input.parameters?.docs?.source}}};const dt=["Default","Searchable","ItemTypes","ClientSearchShorthand","ServerBackedOptions","ServerBackedCustomItems","MultipleSelection","SearchableMultiple","WithSections","SearchableWithSections","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","AutoBg","WithAccessibilityProps"];export{U as AutoBg,C as ClientSearchShorthand,h as Default,L as Disabled,R as DisabledOption,j as ItemTypes,w as MultipleSelection,B as NoOptions,o as Preview,k as Required,v as Searchable,A as SearchableMultiple,I as SearchableWithSections,P as ServerBackedCustomItems,F as ServerBackedOptions,D as Sizes,q as WithAccessibilityProps,E as WithDefaultValue,V as WithError,T as WithFullWidth,O as WithIcon,y as WithLabel,M as WithLabelAndDescription,f as WithLongNames,z as WithLongNamesAndPadding,G as WithManyOptions,W as WithSections,N as WithValue,dt as __namedExportsOrder};
