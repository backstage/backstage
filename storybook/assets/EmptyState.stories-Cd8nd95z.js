import{F as N,H as v,j as t,d as k}from"./iframe--eVtoH1I.js";import{E as d}from"./EmptyState-D83YIrPR.js";import{m as b}from"./makeStyles-qwoBpcZQ.js";import{B as C}from"./Box-AxOQv2ZW.js";import{C as E}from"./CodeSnippet-C8435I_3.js";import{B as h}from"./Button-DoStUTVe.js";import{L as j}from"./Link-BAdxSWkK.js";import"./preload-helper-PPVm8Dsz.js";import"./Grid-BxPVFZFG.js";import"./styled-BNUMKqxB.js";import"./CopyTextButton-Bwnn4YZT.js";import"./useCopyToClipboard-CD7ySspH.js";import"./useMountedState-BJxTErpD.js";import"./Tooltip-Ckjn1o_Q.js";import"./Popper-C6VLYrWu.js";import"./Portal-Cqdnd4y_.js";import"./index-Dqb3Scx7.js";import"./lodash-CSJy54S8.js";import"./index-btJptzr1.js";import"./useAnalytics-BkWkZjko.js";import"./useApp-Br_-UhXC.js";const u=`apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
  description: example.com
  annotations:
    ANNOTATION: value
spec:
  type: website
  lifecycle: production
  owner: user:guest`,f=/^.*ANNOTATION.*$/m,y=u.match(f)[0],I=u.split(`
`).findIndex(e=>f.test(e)),T=b(e=>({code:{borderRadius:6,margin:e.spacing(2,0),background:e.palette.type==="dark"?"#444":e.palette.common.white}}),{name:"BackstageMissingAnnotationEmptyState"});function _(e){return Array.from(Array(e+1).keys(),n=>n+I)}function O(e){const n=e.map(m=>y.replace("ANNOTATION",m)).join(`
`);return u.replace(y,n)}function w(e){const n=e.length<=1;return t.jsxs(t.Fragment,{children:["The ",n?"annotation":"annotations"," ",e.map(m=>t.jsx("code",{children:m})).reduce((m,l)=>t.jsxs(t.Fragment,{children:[m,", ",l]}))," ",n?"is":"are"," missing. You need to add the"," ",n?"annotation":"annotations"," to your component if you want to enable this tool."]})}function S(e){const{annotation:n,readMoreUrl:m}=e,l=Array.isArray(n)?n:[n],A=m||"https://backstage.io/docs/features/software-catalog/well-known-annotations",x=T(),{t:g}=N(v);return t.jsx(d,{missing:"field",title:g("emptyState.missingAnnotation.title"),description:w(l),action:t.jsxs(t.Fragment,{children:[t.jsx(k,{variant:"body1",children:g("emptyState.missingAnnotation.actionTitle")}),t.jsx(C,{className:x.code,children:t.jsx(E,{text:O(l),language:"yaml",showLineNumbers:!0,highlightedNumbers:_(l.length),customStyle:{background:"inherit",fontSize:"115%"}})}),t.jsx(h,{color:"primary",component:j,to:A,children:g("emptyState.missingAnnotation.readMore")})]})})}S.__docgenInfo={description:`@public
@deprecated This component is deprecated, please use {@link @backstage/plugin-catalog-react#MissingAnnotationEmptyState} instead`,methods:[],displayName:"MissingAnnotationEmptyState",props:{annotation:{required:!0,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},readMoreUrl:{required:!1,tsType:{name:"string"},description:""}}};const tt={title:"Feedback/EmptyState",component:d,tags:["!manifest"]},p={width:"100%",height:"100vh"},o=()=>t.jsx("div",{style:p,children:t.jsx(S,{annotation:["backstage.io/foo","backstage.io/bar"]})}),s=()=>t.jsx("div",{style:p,children:t.jsx(d,{missing:"info",title:"No information to display",description:"Add a description here."})}),a=()=>t.jsx("div",{style:p,children:t.jsx(d,{missing:"content",title:"Create a component",description:"Add a description here."})}),i=()=>t.jsx("div",{style:p,children:t.jsx(d,{missing:"data",title:"No builds to show",description:"Add a description here."})}),r=()=>t.jsx("div",{style:p,children:t.jsx(d,{missing:"field",title:"Your plugin is missing an annotation",description:"Click the docs to learn more.",action:t.jsx(h,{color:"primary",href:"#",onClick:()=>{},variant:"contained",children:"DOCS"})})}),c=()=>t.jsx("div",{style:p,children:t.jsx(d,{title:"Custom image example",missing:{customImage:t.jsx("img",{src:"https://backstage.io/animations/backstage-software-catalog-icon-1.gif",alt:"Backstage example"})}})});o.__docgenInfo={description:"",methods:[],displayName:"MissingAnnotation"};s.__docgenInfo={description:"",methods:[],displayName:"Info"};a.__docgenInfo={description:"",methods:[],displayName:"Content"};i.__docgenInfo={description:"",methods:[],displayName:"Data"};r.__docgenInfo={description:"",methods:[],displayName:"WithAction"};c.__docgenInfo={description:"",methods:[],displayName:"CustomImage"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const MissingAnnotation = () => (
  <div style={containerStyle}>
    <MissingAnnotationEmptyState
      annotation={["backstage.io/foo", "backstage.io/bar"]}
    />
  </div>
);
`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Info = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="info"
      title="No information to display"
      description="Add a description here."
    />
  </div>
);
`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Content = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="content"
      title="Create a component"
      description="Add a description here."
    />
  </div>
);
`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const Data = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="data"
      title="No builds to show"
      description="Add a description here."
    />
  </div>
);
`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const WithAction = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="field"
      title="Your plugin is missing an annotation"
      description="Click the docs to learn more."
      action={
        <Button color="primary" href="#" onClick={() => {}} variant="contained">
          DOCS
        </Button>
      }
    />
  </div>
);
`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const CustomImage = () => (
  <div style={containerStyle}>
    <EmptyState
      title="Custom image example"
      missing={{
        customImage: (
          <img
            src="https://backstage.io/animations/backstage-software-catalog-icon-1.gif"
            alt="Backstage example"
          />
        ),
      }}
    />
  </div>
);
`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <MissingAnnotationEmptyState annotation={['backstage.io/foo', 'backstage.io/bar']} />
  </div>`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <EmptyState missing="info" title="No information to display" description="Add a description here." />
  </div>`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <EmptyState missing="content" title="Create a component" description="Add a description here." />
  </div>`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <EmptyState missing="data" title="No builds to show" description="Add a description here." />
  </div>`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <EmptyState missing="field" title="Your plugin is missing an annotation" description="Click the docs to learn more." action={<Button color="primary" href="#" onClick={() => {}} variant="contained">
          DOCS
        </Button>} />
  </div>`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <EmptyState title="Custom image example" missing={{
    customImage: <img src="https://backstage.io/animations/backstage-software-catalog-icon-1.gif" alt="Backstage example" />
  }} />
  </div>`,...c.parameters?.docs?.source}}};const et=["MissingAnnotation","Info","Content","Data","WithAction","CustomImage"];export{a as Content,c as CustomImage,i as Data,s as Info,o as MissingAnnotation,r as WithAction,et as __namedExportsOrder,tt as default};
