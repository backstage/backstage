import{r as d,j as e,m as R,F as k,H as T,e as N}from"./iframe-M9O-K8SB.js";import{M as F,a as H,S as E,b as P}from"./StepLabel-BRV6Yteh.js";import{B}from"./Box-DrVgjJoD.js";import{B as q}from"./Button-JPiqA3bT.js";import{T as D}from"./TextField-Dl4vLPoK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B9sM2jn7.js";import"./Collapse-yN0IR1ZS.js";import"./styled-Ddkk_tuK.js";import"./Select-ByRkfEZ7.js";import"./Popover-9y8CeMZr.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./List-DFXlWgcm.js";import"./ListContext-CQy2fJuy.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CnxnhVyN.js";import"./FormLabel-CaD7F1Na.js";import"./InputLabel-BRgQ3qkL.js";const j=()=>{},_=d.createContext({stepperLength:0,stepIndex:0,setStepIndex:j,stepHistory:[],setStepHistory:j,onStepChange:j});function v(t){const{children:r,elevated:s,onStepChange:i,activeStep:n=0}=t,[o,l]=d.useState(n),x=Array.from({length:n+1},(S,h)=>h),[y,f]=d.useState(x);d.useEffect(()=>{l(n)},[n]);const g=[];let b;return d.Children.forEach(r,S=>{d.isValidElement(S)&&(S.props.end?b=S:g.push(S))}),e.jsxs(e.Fragment,{children:[e.jsx(_.Provider,{value:{stepIndex:o,setStepIndex:l,stepHistory:y,setStepHistory:f,onStepChange:i,stepperLength:d.Children.count(r)},children:e.jsx(F,{activeStep:o,orientation:"vertical",elevation:s?2:0,children:g})}),o>=d.Children.count(r)-1&&b]})}v.__docgenInfo={description:"",methods:[],displayName:"SimpleStepper",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};const L=R(t=>({root:{marginTop:t.spacing(3),"& button":{marginRight:t.spacing(1)}}}),{name:"BackstageSimpleStepperFooter"}),O=({text:t,handleClick:r})=>{const{t:s}=k(T);return e.jsx(q,{onClick:r,children:t||s("simpleStepper.reset")})},$=({text:t,handleClick:r,disabled:s,last:i,stepIndex:n})=>{const{t:o}=k(T);return e.jsx(q,{variant:"contained",color:"primary",disabled:s,"data-testid":`nextButton-${n}`,onClick:r,children:t||o(i?"simpleStepper.finish":"simpleStepper.next")})},M=({text:t,handleClick:r,disabled:s,stepIndex:i})=>{const{t:n}=k(T);return e.jsx(q,{variant:"outlined",color:"primary",disabled:s,"data-testid":`skipButton-${i}`,onClick:r,children:t||n("simpleStepper.skip")})},V=({text:t,handleClick:r,disabled:s,stepIndex:i})=>{const{t:n}=k(T);return e.jsx(q,{onClick:r,"data-testid":`backButton-${i}`,disabled:s,children:t||n("simpleStepper.back")})},C=({actions:t={},children:r})=>{const s=L(),{stepperLength:i,stepIndex:n,setStepIndex:o,stepHistory:l,setStepHistory:x,onStepChange:y}=d.useContext(_),f=(h,I)=>{I&&I(),y&&y(n,h),o(h)},g=()=>{const h=t.nextStep?t.nextStep(n,i-1):n+1;f(h,t.onNext),x([...l,h])},b=()=>{l.pop(),f(l[l.length-1],t.onBack),x([...l])},S=()=>{f(0,t.onRestart),x([0])};return e.jsxs(B,{className:s.root,children:[[void 0,!0].includes(t.showBack)&&n!==0&&e.jsx(V,{text:t.backText,handleClick:b,disabled:n===0,stepIndex:n}),t.showSkip&&e.jsx(M,{text:t.skipText,handleClick:g,disabled:!!i&&n>=i||!!t.canSkip&&!t.canSkip(),stepIndex:n}),[void 0,!0].includes(t.showNext)&&e.jsx($,{text:t.nextText,handleClick:g,disabled:!!i&&n>=i||!!t.canNext&&!t.canNext(),stepIndex:n}),t.showRestart&&n!==0&&e.jsx(O,{text:t.restartText,handleClick:S,stepIndex:n}),r]})};O.__docgenInfo={description:"",methods:[],displayName:"RestartBtn",props:{text:{required:!1,tsType:{name:"string"},description:""},handleClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},stepIndex:{required:!0,tsType:{name:"number"},description:""}}};C.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperFooter",props:{actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  showNext?: boolean;
  canNext?: () => boolean;
  onNext?: () => void;
  nextStep?: (current: number, last: number) => number;
  nextText?: string;

  showBack?: boolean;
  backText?: string;
  onBack?: () => void;

  showRestart?: boolean;
  canRestart?: () => boolean;
  onRestart?: () => void;
  restartText?: string;

  showSkip?: boolean;
  canSkip?: () => boolean;
  onSkip?: () => void;
  skipText?: string;
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:"",defaultValue:{value:"{}",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Y=R(t=>({end:{padding:t.spacing(3)}}),{name:"SimpleStepperStep"});function p(t){const{title:r,children:s,end:i,actions:n,...o}=t,l=Y();return i?e.jsxs(B,{className:l.end,children:[e.jsx(N,{variant:"h6",children:r}),s,e.jsx(C,{actions:{...n||{},showNext:!1}})]}):e.jsxs(H,{...o,children:[e.jsx(E,{children:e.jsx(N,{variant:"h6",children:r})}),e.jsxs(P,{children:[s,e.jsx(C,{actions:n})]})]})}p.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperStep",props:{title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactElement"},description:""},end:{required:!1,tsType:{name:"boolean"},description:""},actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  showNext?: boolean;
  canNext?: () => boolean;
  onNext?: () => void;
  nextStep?: (current: number, last: number) => number;
  nextText?: string;

  showBack?: boolean;
  backText?: string;
  onBack?: () => void;

  showRestart?: boolean;
  canRestart?: () => boolean;
  onRestart?: () => void;
  restartText?: string;

  showSkip?: boolean;
  canSkip?: () => boolean;
  onSkip?: () => void;
  skipText?: string;
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:""}}};const le={title:"Navigation/SimpleStepper",component:v,tags:["!manifest"]},w={elevated:!1,activeStep:0},u=t=>e.jsxs(v,{...t,children:[e.jsx(p,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(p,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(p,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]});u.args=w;const a=t=>{const[r,s]=d.useState(!1);return e.jsxs(v,{...t,children:[e.jsx(p,{title:"Step 1 with required field",actions:{canNext:()=>r},children:e.jsx(D,{variant:"outlined",placeholder:"Required*",onChange:i=>s(!!i.target.value)})}),e.jsx(p,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(p,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]})};a.args=w;const m=t=>e.jsxs(v,{...t,children:[e.jsx(p,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(p,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(p,{title:"Success!",end:!0,children:e.jsx("div",{children:"You've completed the Stepper"})})]});m.args=w;const c=t=>e.jsxs(v,{...t,children:[e.jsx(p,{title:"Step 1 (Optional)",actions:{showSkip:!0},children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(p,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})})]});a.args=w;u.__docgenInfo={description:"",methods:[],displayName:"Default",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};a.__docgenInfo={description:"",methods:[],displayName:"ConditionalButtons",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};m.__docgenInfo={description:"",methods:[],displayName:"CompletionStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};c.__docgenInfo={description:"",methods:[],displayName:"OptionalStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const Default = () => (
  <SimpleStepper>
    <SimpleStepperStep title="Step 1">
      <div>This is the content for step 1</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 2">
      <div>This is the content for step 2</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 3">
      <div>This is the content for step 3</div>
    </SimpleStepperStep>
  </SimpleStepper>
);
`,...u.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const ConditionalButtons = () => {
  const [required, setRequired] = useState(false);

  return (
    <SimpleStepper>
      <SimpleStepperStep
        title="Step 1 with required field"
        actions={{
          canNext: () => required,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Required*"
          onChange={(e) => setRequired(!!e.target.value)}
        />
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 3">
        <div>This is the content for step 3</div>
      </SimpleStepperStep>
    </SimpleStepper>
  );
};
`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{code:`const CompletionStep = () => {
  return (
    <SimpleStepper>
      <SimpleStepperStep title="Step 1">
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Success!" end>
        <div>You've completed the Stepper</div>
      </SimpleStepperStep>
    </SimpleStepper>
  );
};
`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const OptionalStep = () => {
  return (
    <SimpleStepper>
      <SimpleStepperStep
        title="Step 1 (Optional)"
        actions={{
          showSkip: true,
        }}
      >
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
    </SimpleStepper>
  );
};
`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`(args: StepperProps) => <SimpleStepper {...args}>
    <SimpleStepperStep title="Step 1">
      <div>This is the content for step 1</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 2">
      <div>This is the content for step 2</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 3">
      <div>This is the content for step 3</div>
    </SimpleStepperStep>
  </SimpleStepper>`,...u.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
  const [required, setRequired] = useState(false);
  return <SimpleStepper {...args}>
      <SimpleStepperStep title="Step 1 with required field" actions={{
      canNext: () => required
    }}>
        <TextField variant="outlined" placeholder="Required*" onChange={e => setRequired(!!e.target.value)} />
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 3">
        <div>This is the content for step 3</div>
      </SimpleStepperStep>
    </SimpleStepper>;
}`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
  return <SimpleStepper {...args}>
      <SimpleStepperStep title="Step 1">
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Success!" end>
        <div>You've completed the Stepper</div>
      </SimpleStepperStep>
    </SimpleStepper>;
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
  return <SimpleStepper {...args}>
      <SimpleStepperStep title="Step 1 (Optional)" actions={{
      showSkip: true
    }}>
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
    </SimpleStepper>;
}`,...c.parameters?.docs?.source}}};const de=["Default","ConditionalButtons","CompletionStep","OptionalStep"];export{m as CompletionStep,a as ConditionalButtons,u as Default,c as OptionalStep,de as __namedExportsOrder,le as default};
