import{bR as e,i as b,c7 as me,ca as ge}from"./iframe-Bm5ba6Eo.js";import{S as l,c as y,b as re,a as te}from"./Select-CcZYqr70.js";import{a as he}from"./useFormValidation-BwB-mcjl.js";import{$ as se}from"./useAsyncList-T0h-TUwW.js";import{T as x,H as oe}from"./index-CvgDpp5W.js";import{F as g}from"./Flex-CJJjo3o-.js";import{T as m}from"./Text-BSflCEKy.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DQNqlcud.js";import"./utils-6JHcszxz.js";import"./useObjectRef--OGAdRX4.js";import"./Label-DY58aZxy.js";import"./Hidden-BsS8bYU7.js";import"./useFocusRing-pVGFXoDo.js";import"./openLink-B3PKQziN.js";import"./useLabel-CioGoMcV.js";import"./useLabels-BjdHlKX9.js";import"./number-i5bTXygz.js";import"./I18nProvider-Bs_Dburj.js";import"./useButton-5MOeMbef.js";import"./usePress-CKNoHEcf.js";import"./textSelection-B3oHrBsf.js";import"./useHover-BTqfxkN_.js";import"./FieldError-BJ3zMt3J.js";import"./Text-B1aMhdj3.js";import"./ListBox-DK_quA4C.js";import"./useCollection-HldmDXHz.js";import"./keyboard-CfEZ52uC.js";import"./FocusScope-CR1y382h.js";import"./useEvent-BsoZAZmF.js";import"./useControlledState-C1wfIORH.js";import"./getItemCount-DYn-VD-2.js";import"./Autocomplete-DLryka1G.js";import"./useLocalizedStringFormatter-LuBD_Ap4.js";import"./useListState-Dhevo4OT.js";import"./Dialog-B2nmK5qO.js";import"./Heading-DLRVzBli.js";import"./useOverlayTriggerState-TZO6sVsq.js";import"./VisuallyHidden-B4FkZmrw.js";import"./animation-BfQmUzHQ.js";import"./useField-4sm3jRhu.js";import"./useFormReset-B0TSkwTz.js";import"./Input-QC44x5uc.js";import"./SearchField-uJ4gyLpy.js";import"./useTextField-DBlobsLC.js";import"./useFilter-Bzo5srqG.js";import"./useCollectionAdapter-BRxwA_2q.js";import"./Avatar-iQ2uOcZF.js";import"./Skeleton-DYmnfvSB.js";import"./FieldLabel-BsMPqoVj.js";import"./FieldError-D7YGnbGV.js";import"./Popover-BP7rlqYp.js";import"./useListData-QaZbIzJE.js";const{expect:s,screen:ne,waitFor:h}=__STORYBOOK_MODULE_TEST__,a=me.meta({title:"Backstage UI/Select",component:l,args:{style:{width:300}}}),C=[{id:"sans",label:"Sans-serif"},{id:"serif",label:"Serif"},{id:"mono",label:"Monospace"},{id:"cursive",label:"Cursive"}],le=[{id:"us",label:"United States"},{id:"ca",label:"Canada"},{id:"mx",label:"Mexico"},{id:"uk",label:"United Kingdom"},{id:"fr",label:"France"},{id:"de",label:"Germany"},{id:"it",label:"Italy"},{id:"es",label:"Spain"},{id:"jp",label:"Japan"},{id:"cn",label:"China"},{id:"in",label:"India"},{id:"br",label:"Brazil"},{id:"au",label:"Australia"}],ye=[{id:"react",label:"React"},{id:"typescript",label:"TypeScript"},{id:"javascript",label:"JavaScript"},{id:"python",label:"Python"},{id:"java",label:"Java"},{id:"csharp",label:"C#"},{id:"go",label:"Go"},{id:"rust",label:"Rust"},{id:"kotlin",label:"Kotlin"},{id:"swift",label:"Swift"}],f=a.story({args:{options:C,name:"font"}}),P=a.story({args:{label:"Country",search:{placeholder:"Search countries..."},options:le}});function ie({size:t}){return e.jsxs(g,{direction:"column",gap:"4",style:{width:280},children:[e.jsx(m,{as:"div",weight:"bold",children:t==="small"?"Small":"Medium"}),e.jsxs(l,{size:t,label:"Title items",placeholder:"Select a status",style:{width:"100%"},children:[e.jsx(y,{id:"active",title:"Active"}),e.jsx(y,{id:"inactive",title:"Inactive"})]}),e.jsxs(l,{size:t,label:"Icon and title items",placeholder:"Select a deployment target",style:{width:"100%"},children:[e.jsx(y,{id:"cloud",title:"Cloud",leadingIcon:e.jsx(x,{})}),e.jsx(y,{id:"private-cloud",title:"Private cloud",leadingIcon:e.jsx(x,{})})]}),e.jsxs(l,{size:t,label:"Title and description items",placeholder:"Select a release channel",style:{width:"100%"},children:[e.jsx(y,{id:"stable",title:"Stable",description:"Recommended for production workloads"}),e.jsx(y,{id:"beta",title:"Beta",description:"Preview upcoming features"})]}),e.jsxs(l,{size:t,label:"Icon, title, and description items",placeholder:"Select a deployment target",style:{width:"100%"},children:[e.jsx(y,{id:"production-cloud",title:"Production cloud",description:"Runs production workloads",leadingIcon:e.jsx(x,{})}),e.jsx(y,{id:"staging-cloud",title:"Staging cloud",description:"Runs pre-production workloads",leadingIcon:e.jsx(x,{})})]}),e.jsxs(l,{size:t,label:"Profile items",placeholder:"Select an owner",style:{width:"100%"},children:[e.jsx(re,{id:"ada",name:"Ada Lovelace",src:"https://avatars.githubusercontent.com/u/1540635?v=4"}),e.jsx(re,{id:"grace",name:"Grace Hopper"})]}),e.jsxs(l,{size:t,label:"Custom items",placeholder:"Select a custom item",style:{width:"100%"},children:[e.jsx(te,{id:"nightly",textValue:"Nightly builds",children:({isSelected:n})=>e.jsxs(g,{align:"center",justify:"between",gap:"2",children:[e.jsxs(b,{style:{flex:1},children:[e.jsx(m,{as:"div",weight:"bold",children:"Nightly builds"}),e.jsx(m,{as:"div",variant:"body-small",color:"secondary",children:"Updated every night"})]}),n&&e.jsx(oe,{"aria-label":"Selected"})]})}),e.jsx(te,{id:"canary",textValue:"Canary builds",children:({isSelected:n})=>e.jsxs(g,{align:"center",justify:"between",gap:"2",children:[e.jsxs(b,{style:{flex:1},children:[e.jsx(m,{as:"div",weight:"bold",children:"Canary builds"}),e.jsx(m,{as:"div",variant:"body-small",color:"secondary",children:"Updated after every merge"})]}),n&&e.jsx(oe,{"aria-label":"Selected"})]})})]})]})}const R=a.story({render:()=>e.jsxs(g,{align:"start",gap:"6",children:[e.jsx(ie,{size:"small"}),e.jsx(ie,{size:"medium"})]})}),O=a.story({args:{label:"Country",search:!0,options:le}}),ce=[{id:"ada",name:"Ada Lovelace",role:"Software Engineer"},{id:"grace",name:"Grace Hopper",role:"Computer Scientist"},{id:"margaret",name:"Margaret Hamilton",role:"Software Engineer"},{id:"katherine",name:"Katherine Johnson",role:"Mathematician"},{id:"annie",name:"Annie Easley",role:"Computer Scientist"},{id:"mary",name:"Mary Jackson",role:"Aerospace Engineer"},{id:"dorothy",name:"Dorothy Vaughan",role:"Mathematician"},{id:"radia",name:"Radia Perlman",role:"Network Engineer"},{id:"barbara",name:"Barbara Liskov",role:"Computer Scientist"},{id:"frances",name:"Frances Allen",role:"Computer Scientist"},{id:"evelyn",name:"Evelyn Boyd Granville",role:"Mathematician"},{id:"mary-keller",name:"Mary Kenneth Keller",role:"Computer Scientist"},{id:"hedy",name:"Hedy Lamarr",role:"Inventor"},{id:"joan",name:"Joan Clarke",role:"Cryptanalyst"},{id:"mary-ross",name:"Mary Golda Ross",role:"Aerospace Engineer"},{id:"ellen",name:"Ellen Ochoa",role:"Aerospace Engineer"},{id:"rebecca",name:"Rebecca Lee Crumpler",role:"Physician"},{id:"chiyome",name:"Chiyome Fukino",role:"Physician"},{id:"susan",name:"Susan Kare",role:"Designer"},{id:"mary-coombs",name:"Mary Coombs",role:"Programmer"}];ce.map(t=>({id:t.id,label:t.name}));const j=Array.from({length:200},(t,n)=>({id:`owner-${n+1}`,label:`Owner ${String(n+1).padStart(3,"0")}`})),ae=t=>new Promise(n=>setTimeout(n,t)),be=1500,Se=5,xe=100,F=10;function S(t){return Number(t.textContent)}async function pe(t){let n=S(t),c=0;for(let p=0;p<20;p++){await ae(250);const o=S(t);if(o===n){if(c+=1,c===3)return o}else n=o,c=0}throw new Error("Request count did not stabilize")}function de({searchable:t}){const n=t?"Searchable Select":"Select",[c,p]=ge.useState(0),o=se({async load({cursor:i,filterText:r}){p(ee=>ee+1),await ae(xe);const d=r.toLocaleLowerCase(),w=j.filter(ee=>ee.label.toLocaleLowerCase().includes(d)),T=i?Number(i):0,X=T+F;return{items:w.slice(T,X),cursor:X<w.length?String(X):void 0}}});return e.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center"},children:e.jsxs("div",{children:[e.jsxs("div",{children:["Requests:"," ",e.jsx("output",{"aria-label":`${n} request count`,children:c})]}),e.jsxs("div",{children:["Results:"," ",e.jsx("output",{"aria-label":`${n} result count`,children:o.items.length})]}),e.jsx(l,{label:"Owner",placeholder:"Select an owner",options:o,search:t?{mode:"server",placeholder:"Search owners..."}:void 0,style:{width:300}})]})})}const E=a.story({render:()=>e.jsx(de,{searchable:!1}),parameters:{layout:"fullscreen"},play:async({canvas:t,userEvent:n})=>{const c=t.getByLabelText("Select request count"),p=t.getByLabelText("Select result count");await h(()=>s(S(p)).toBe(F)),await n.click(t.getByRole("button"));const o=await ne.findByRole("listbox"),i=o.closest(".bui-SelectResults");s(i).toBeTruthy(),s(window.getComputedStyle(o).maxHeight).toBe("none"),await h(()=>s(i.scrollHeight).toBeGreaterThan(i.clientHeight),{timeout:5e3});const r=await pe(c);s(r).toBeLessThan(j.length/F),s(S(p)).toBeLessThan(j.length),o.focus(),await n.keyboard("{End}");const d=i.scrollHeight-i.clientHeight;i.scrollTop=d,await h(()=>s(i.scrollTop).toBeGreaterThanOrEqual(d-1)),await h(()=>s(S(c)).toBeGreaterThan(r),{timeout:5e3})}}),A=a.story({render:()=>e.jsx(de,{searchable:!0}),parameters:{layout:"fullscreen"},play:async({canvas:t,userEvent:n})=>{const c=t.getByLabelText("Searchable Select request count"),p=t.getByLabelText("Searchable Select result count");await h(()=>s(S(p)).toBe(F)),await n.click(t.getByRole("button"));const o=await ne.findByRole("listbox"),i=await ne.findByRole("searchbox"),r=o.closest(".bui-SelectResults");s(r).toBeTruthy(),s(r).not.toContainElement(i),s(window.getComputedStyle(o).maxHeight).toBe("none"),await h(()=>s(r.scrollHeight).toBeGreaterThan(r.clientHeight),{timeout:5e3});const d=await pe(c);s(d).toBeLessThan(j.length/F),s(S(p)).toBeLessThan(j.length);const w=i.getBoundingClientRect().top;o.focus(),await n.keyboard("{End}");const T=r.scrollHeight-r.clientHeight;r.scrollTop=T,await h(()=>s(r.scrollTop).toBeGreaterThanOrEqual(T-1)),await h(()=>s(S(c)).toBeGreaterThan(d),{timeout:5e3}),await h(()=>s(Math.abs(i.getBoundingClientRect().top-w)).toBeLessThan(1)),s(i).toBeVisible()}});function fe(){const t=se({async load({cursor:n,filterText:c}){await ae(be);const p=c.toLocaleLowerCase(),o=ce.filter(d=>`${d.name} ${d.role}`.toLocaleLowerCase().includes(p)),i=n?Number(n):0,r=i+Se;return{items:o.slice(i,r),cursor:r<o.length?String(r):void 0}}});return e.jsx(l,{label:"Owner",placeholder:"Select an owner",items:t,search:{mode:"server",placeholder:"Search names and roles..."},style:{width:300},children:n=>e.jsxs(te,{textValue:n.name,children:[e.jsx(m,{as:"div",weight:"bold",children:n.name}),e.jsx(m,{as:"div",variant:"body-small",color:"secondary",children:n.role})]})})}const L=a.story({render:()=>e.jsx(fe,{})}),k=a.story({args:{label:"Select multiple options",selectionMode:"multiple",options:[{id:"option1",label:"Option 1"},{id:"option2",label:"Option 2"},{id:"option3",label:"Option 3"},{id:"option4",label:"Option 4"}]}}),W=a.story({args:{label:"Skills",search:{placeholder:"Filter skills..."},selectionMode:"multiple",options:ye}}),ue=[{title:"Serif Fonts",options:[{id:"times",label:"Times New Roman"},{id:"georgia",label:"Georgia"},{id:"garamond",label:"Garamond"}]},{title:"Sans-Serif Fonts",options:[{id:"arial",label:"Arial"},{id:"helvetica",label:"Helvetica"},{id:"verdana",label:"Verdana"}]},{title:"Monospace Fonts",options:[{id:"courier",label:"Courier New"},{id:"consolas",label:"Consolas"},{id:"fira",label:"Fira Code"}]}],I=a.story({args:{label:"Font Family",options:ue,name:"font"}}),M=a.story({args:{label:"Font Family",search:{placeholder:"Search fonts..."},options:ue,name:"font"}}),u=a.story({args:{label:"Font Family",options:C,placeholder:"Select a font",name:"font",style:{maxWidth:260}}}),v=a.story({args:{...f.input.args,label:"Font Family"}}),D=a.story({args:{...f.input.args,label:"Font Family",style:{width:"100%"}}}),q=a.story({args:{...v.input.args,description:"Choose a font family for your document"}}),N=a.story({args:{...v.input.args},render:t=>e.jsx(l,{...t,icon:e.jsx(x,{})})}),z=a.story({args:{...u.input.args},render:t=>e.jsxs(g,{direction:"row",gap:"2",children:[e.jsx(l,{...t,size:"small",icon:e.jsx(x,{})}),e.jsx(l,{...t,size:"medium",icon:e.jsx(x,{})})]})}),G=a.story({args:{...u.input.args,isRequired:!0}}),H=a.story({args:{...u.input.args,isDisabled:!0}}),V=a.story({args:{...u.input.args,disabledKeys:["cursive","serif"]}}),U=a.story({args:{...u.input.args,options:void 0}}),$=a.story({args:{...u.input.args,value:"mono"}}),_=a.story({args:{...u.input.args,defaultValue:"serif",options:C,name:"font"}}),ve=(t=100)=>{const n=["Moon","Sun","Star","Cosmic","Globe","Flux","Nova","Echo","Pulse","Vertex","Nexus","Orbit","Prism","Quantum","Zenith","Aura","Crystal","Shadow","Phantom","Azure","Ember","Frost","Horizon","Mystic","Raven","Solstice","Tempest","Vortex","Whisper","Zephyr"],c=["green","blue","red","black","white","silver","gold","copper","bronze","steel","flow","light","dark","dream","stream","life","sight","mind","craft","blend","wave","swift","sharp","soft","bold","clear","deep","lift","shift","grace"],p=["Sans","Serif","Mono","Script","Display","Slab","Round","Thin","Bold","Italic","Pro","Neo","Prime","Plus","One","Two","Nova","Ultra","Elite","Max","Type","Text","View","Graph","Print","Read","Write","Book","Note","Letter"],o=r=>r[Math.floor(Math.random()*r.length)],i=Array.from({length:t}).map(()=>{const r=o(n),d=o(c),w=o(p);return`${r}${d} ${w}`}).reduce((r,d)=>(r.add(d),r),new Set).values();return Array.from(i).map(r=>({id:r.toLocaleLowerCase("en-US").replaceAll(" ","-"),label:r}))},K=a.story({args:{label:"Font Family",options:ve(),name:"font"}}),Q=a.story({args:{...v.input.args,name:"font"},render:t=>e.jsx(he,{validationErrors:{font:"Invalid font family"},children:e.jsx(l,{...t})})}),B=a.story({args:{label:"Document Template",options:[{id:"annual-report-2024",label:"Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions"},{id:"product-roadmap",label:"Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings"},{id:"user-guide",label:"Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions"},{id:"marketing-plan",label:"Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology"},{id:"research-paper",label:"Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines"}],placeholder:"Select a document template",name:"template",style:{maxWidth:400},defaultValue:"annual-report-2024"}}),J=a.story({args:{...B.input.args},decorators:[(t,{args:n})=>e.jsx("div",{style:{padding:128},children:e.jsx(t,{...n})})]}),Y=a.story({render:()=>e.jsxs(g,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"Select automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(b,{bg:"neutral",p:"4",children:[e.jsx(m,{children:"Neutral 1 container"}),e.jsx(g,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(l,{options:C,"aria-label":"Font family"})})]}),e.jsx(b,{bg:"neutral",children:e.jsxs(b,{bg:"neutral",p:"4",children:[e.jsx(m,{children:"Neutral 2 container"}),e.jsx(g,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(l,{options:C,"aria-label":"Font family"})})]})}),e.jsx(b,{bg:"neutral",children:e.jsx(b,{bg:"neutral",children:e.jsxs(b,{bg:"neutral",p:"4",children:[e.jsx(m,{children:"Neutral 3 container"}),e.jsx(g,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(l,{options:C,"aria-label":"Font family"})})]})})})]})}),Z=a.story({args:{...f.input.args},render:t=>e.jsxs(g,{direction:"column",gap:"4",children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-label"}),e.jsx(l,{...t,"aria-label":"Choose font family",placeholder:"Select a font family",name:"font-aria"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:8},children:"With aria-labelledby"}),e.jsx("div",{id:"font-label",style:{marginBottom:8,fontWeight:600},children:"Font Family Selection"}),e.jsx(l,{...t,"aria-labelledby":"font-label",placeholder:"Select a font family",name:"font-labelledby"})]})]})});f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    options: fontOptions,
    name: 'font'
  }
})`,...f.input.parameters?.docs?.source}}};P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Country',
    search: {
      placeholder: 'Search countries...'
    },
    options: countries
  }
})`,...P.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="start" gap="6">
      <SelectItemTypesColumn size="small" />
      <SelectItemTypesColumn size="medium" />
    </Flex>
})`,...R.input.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Country',
    search: true,
    options: countries
  }
})`,...O.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ServerBackedSelect searchable={false} />,
  parameters: {
    layout: 'fullscreen'
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    const requestCount = canvas.getByLabelText('Select request count');
    const resultCount = canvas.getByLabelText('Select result count');
    await waitFor(() => expect(readCount(resultCount)).toBe(paginationServerPageSize));
    await userEvent.click(canvas.getByRole('button'));
    const listbox = await screen.findByRole('listbox');
    const scrollElement = listbox.closest('.bui-SelectResults');
    expect(scrollElement).toBeTruthy();
    expect(window.getComputedStyle(listbox).maxHeight).toBe('none');
    await waitFor(() => expect(scrollElement!.scrollHeight).toBeGreaterThan(scrollElement!.clientHeight), {
      timeout: 5_000
    });
    const stabilizedRequestCount = await waitForRequestCountToStabilize(requestCount);
    expect(stabilizedRequestCount).toBeLessThan(paginatedServerOptions.length / paginationServerPageSize);
    expect(readCount(resultCount)).toBeLessThan(paginatedServerOptions.length);
    listbox.focus();
    await userEvent.keyboard('{End}');
    const bottomScrollTop = scrollElement!.scrollHeight - scrollElement!.clientHeight;
    scrollElement!.scrollTop = bottomScrollTop;
    await waitFor(() => expect(scrollElement!.scrollTop).toBeGreaterThanOrEqual(bottomScrollTop - 1));
    await waitFor(() => expect(readCount(requestCount)).toBeGreaterThan(stabilizedRequestCount), {
      timeout: 5_000
    });
  }
})`,...E.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ServerBackedSelect searchable />,
  parameters: {
    layout: 'fullscreen'
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    const requestCount = canvas.getByLabelText('Searchable Select request count');
    const resultCount = canvas.getByLabelText('Searchable Select result count');
    await waitFor(() => expect(readCount(resultCount)).toBe(paginationServerPageSize));
    await userEvent.click(canvas.getByRole('button'));
    const listbox = await screen.findByRole('listbox');
    const searchbox = await screen.findByRole('searchbox');
    const scrollElement = listbox.closest('.bui-SelectResults');
    expect(scrollElement).toBeTruthy();
    expect(scrollElement).not.toContainElement(searchbox);
    expect(window.getComputedStyle(listbox).maxHeight).toBe('none');
    await waitFor(() => expect(scrollElement!.scrollHeight).toBeGreaterThan(scrollElement!.clientHeight), {
      timeout: 5_000
    });
    const stabilizedRequestCount = await waitForRequestCountToStabilize(requestCount);
    expect(stabilizedRequestCount).toBeLessThan(paginatedServerOptions.length / paginationServerPageSize);
    expect(readCount(resultCount)).toBeLessThan(paginatedServerOptions.length);
    const searchboxTop = searchbox.getBoundingClientRect().top;
    listbox.focus();
    await userEvent.keyboard('{End}');
    const bottomScrollTop = scrollElement!.scrollHeight - scrollElement!.clientHeight;
    scrollElement!.scrollTop = bottomScrollTop;
    await waitFor(() => expect(scrollElement!.scrollTop).toBeGreaterThanOrEqual(bottomScrollTop - 1));
    await waitFor(() => expect(readCount(requestCount)).toBeGreaterThan(stabilizedRequestCount), {
      timeout: 5_000
    });
    await waitFor(() => expect(Math.abs(searchbox.getBoundingClientRect().top - searchboxTop)).toBeLessThan(1));
    expect(searchbox).toBeVisible();
  }
})`,...A.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ServerBackedCustomSelect />
})`,...L.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...k.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Skills',
    search: {
      placeholder: 'Filter skills...'
    },
    selectionMode: 'multiple',
    options: skills
  }
})`,...W.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: sectionedOptions,
    name: 'font'
  }
})`,...I.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    search: {
      placeholder: 'Search fonts...'
    },
    options: sectionedOptions,
    name: 'font'
  }
})`,...M.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: {
      maxWidth: 260
    }
  }
})`,...u.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family'
  }
})`,...v.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: {
      width: '100%'
    }
  }
})`,...D.input.parameters?.docs?.source}}};q.input.parameters={...q.input.parameters,docs:{...q.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document'
  }
})`,...q.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />
})`,...N.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args
  },
  render: args => <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
})`,...z.input.parameters?.docs?.source}}};G.input.parameters={...G.input.parameters,docs:{...G.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isRequired: true
  }
})`,...G.input.parameters?.docs?.source}}};H.input.parameters={...H.input.parameters,docs:{...H.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true
  }
})`,...H.input.parameters?.docs?.source}}};V.input.parameters={...V.input.parameters,docs:{...V.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif']
  }
})`,...V.input.parameters?.docs?.source}}};U.input.parameters={...U.input.parameters,docs:{...U.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    options: undefined
  }
})`,...U.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    value: 'mono'
  }
})`,...$.input.parameters?.docs?.source}}};_.input.parameters={..._.input.parameters,docs:{..._.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Preview.input.args,
    defaultValue: 'serif',
    options: fontOptions,
    name: 'font'
  }
})`,..._.input.parameters?.docs?.source}}};K.input.parameters={...K.input.parameters,docs:{...K.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font'
  }
})`,...K.input.parameters?.docs?.source}}};Q.input.parameters={...Q.input.parameters,docs:{...Q.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font'
  },
  render: args => <Form validationErrors={{
    font: 'Invalid font family'
  }}>
      <Select {...args} />
    </Form>
})`,...Q.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};J.input.parameters={...J.input.parameters,docs:{...J.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...J.input.parameters?.docs?.source}}};Y.input.parameters={...Y.input.parameters,docs:{...Y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...Y.input.parameters?.docs?.source}}};Z.input.parameters={...Z.input.parameters,docs:{...Z.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...Z.input.parameters?.docs?.source}}};const vt=["Default","Searchable","ItemTypes","ClientSearchShorthand","ServerBackedNonSearchableOptions","ServerBackedOptions","ServerBackedCustomItems","MultipleSelection","SearchableMultiple","WithSections","SearchableWithSections","Preview","WithLabel","WithFullWidth","WithLabelAndDescription","WithIcon","Sizes","Required","Disabled","DisabledOption","NoOptions","WithValue","WithDefaultValue","WithManyOptions","WithError","WithLongNames","WithLongNamesAndPadding","AutoBg","WithAccessibilityProps"];export{Y as AutoBg,O as ClientSearchShorthand,f as Default,H as Disabled,V as DisabledOption,R as ItemTypes,k as MultipleSelection,U as NoOptions,u as Preview,G as Required,P as Searchable,W as SearchableMultiple,M as SearchableWithSections,L as ServerBackedCustomItems,E as ServerBackedNonSearchableOptions,A as ServerBackedOptions,z as Sizes,Z as WithAccessibilityProps,_ as WithDefaultValue,Q as WithError,D as WithFullWidth,N as WithIcon,v as WithLabel,q as WithLabelAndDescription,B as WithLongNames,J as WithLongNamesAndPadding,K as WithManyOptions,I as WithSections,$ as WithValue,vt as __namedExportsOrder};
