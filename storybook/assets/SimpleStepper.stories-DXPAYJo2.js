import{r as l,j as e,m as R,k,l as T,d as N}from"./iframe-CA0Xqitl.js";import{M as H,a as O,S as F,b as P}from"./StepLabel-IVa_EH_d.js";import{B}from"./Box-Ds7zC8BR.js";import{B as q}from"./Button-CbaUxuKj.js";import{T as L}from"./TextField-CbQKOlJB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B9sM2jn7.js";import"./Collapse-BpZh4zHv.js";import"./styled-BOzNBejn.js";import"./Select-DNkSp5Jx.js";import"./Popover-BmPtjFBs.js";import"./Modal-CxVdZ6wB.js";import"./Portal-DUJxNLzx.js";import"./List-BnsnRWJY.js";import"./ListContext-TMUZkd5u.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BujB911u.js";import"./FormLabel-B3GaXop_.js";import"./InputLabel--gwgFf8r.js";const w=()=>{},_=l.createContext({stepperLength:0,stepIndex:0,setStepIndex:w,stepHistory:[],setStepHistory:w,onStepChange:w});function x(t){const{children:r,elevated:i,onStepChange:a,activeStep:n=0}=t,[p,o]=l.useState(n),h=Array.from({length:n+1},(u,d)=>d),[y,g]=l.useState(h);l.useEffect(()=>{o(n)},[n]);const v=[];let b;return l.Children.forEach(r,u=>{l.isValidElement(u)&&(u.props.end?b=u:v.push(u))}),e.jsxs(e.Fragment,{children:[e.jsx(_.Provider,{value:{stepIndex:p,setStepIndex:o,stepHistory:y,setStepHistory:g,onStepChange:a,stepperLength:l.Children.count(r)},children:e.jsx(H,{activeStep:p,orientation:"vertical",elevation:i?2:0,children:v})}),p>=l.Children.count(r)-1&&b]})}x.__docgenInfo={description:"",methods:[],displayName:"SimpleStepper",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};const $=R(t=>({root:{marginTop:t.spacing(3),"& button":{marginRight:t.spacing(1)}}}),{name:"BackstageSimpleStepperFooter"}),E=({text:t,handleClick:r})=>{const{t:i}=k(T);return e.jsx(q,{onClick:r,children:t||i("simpleStepper.reset")})},D=({text:t,handleClick:r,disabled:i,last:a,stepIndex:n})=>{const{t:p}=k(T);return e.jsx(q,{variant:"contained",color:"primary",disabled:i,"data-testid":`nextButton-${n}`,onClick:r,children:t||p(a?"simpleStepper.finish":"simpleStepper.next")})},M=({text:t,handleClick:r,disabled:i,stepIndex:a})=>{const{t:n}=k(T);return e.jsx(q,{variant:"outlined",color:"primary",disabled:i,"data-testid":`skipButton-${a}`,onClick:r,children:t||n("simpleStepper.skip")})},V=({text:t,handleClick:r,disabled:i,stepIndex:a})=>{const{t:n}=k(T);return e.jsx(q,{onClick:r,"data-testid":`backButton-${a}`,disabled:i,children:t||n("simpleStepper.back")})},I=({actions:t={},children:r})=>{const i=$(),{stepperLength:a,stepIndex:n,setStepIndex:p,stepHistory:o,setStepHistory:h,onStepChange:y}=l.useContext(_),g=(d,C)=>{C&&C(),y&&y(n,d),p(d)},v=()=>{const d=t.nextStep?t.nextStep(n,a-1):n+1;g(d,t.onNext),h([...o,d])},b=()=>{o.pop(),g(o[o.length-1],t.onBack),h([...o])},u=()=>{g(0,t.onRestart),h([0])};return e.jsxs(B,{className:i.root,children:[[void 0,!0].includes(t.showBack)&&n!==0&&e.jsx(V,{text:t.backText,handleClick:b,disabled:n===0,stepIndex:n}),t.showSkip&&e.jsx(M,{text:t.skipText,handleClick:v,disabled:!!a&&n>=a||!!t.canSkip&&!t.canSkip(),stepIndex:n}),[void 0,!0].includes(t.showNext)&&e.jsx(D,{text:t.nextText,handleClick:v,disabled:!!a&&n>=a||!!t.canNext&&!t.canNext(),stepIndex:n}),t.showRestart&&n!==0&&e.jsx(E,{text:t.restartText,handleClick:u,stepIndex:n}),r]})};E.__docgenInfo={description:"",methods:[],displayName:"RestartBtn",props:{text:{required:!1,tsType:{name:"string"},description:""},handleClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},stepIndex:{required:!0,tsType:{name:"number"},description:""}}};I.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperFooter",props:{actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:"",defaultValue:{value:"{}",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const A=R(t=>({end:{padding:t.spacing(3)}}),{name:"SimpleStepperStep"});function s(t){const{title:r,children:i,end:a,actions:n,...p}=t,o=A();return a?e.jsxs(B,{className:o.end,children:[e.jsx(N,{variant:"h6",children:r}),i,e.jsx(I,{actions:{...n||{},showNext:!1}})]}):e.jsxs(O,{...p,children:[e.jsx(F,{children:e.jsx(N,{variant:"h6",children:r})}),e.jsxs(P,{children:[i,e.jsx(I,{actions:n})]})]})}s.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperStep",props:{title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactElement"},description:""},end:{required:!1,tsType:{name:"boolean"},description:""},actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:""}}};const le={title:"Navigation/SimpleStepper",component:x},j={elevated:!1,activeStep:0},c=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]});c.args=j;const m=t=>{const[r,i]=l.useState(!1);return e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 with required field",actions:{canNext:()=>r},children:e.jsx(L,{variant:"outlined",placeholder:"Required*",onChange:a=>i(!!a.target.value)})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]})};m.args=j;const S=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Success!",end:!0,children:e.jsx("div",{children:"You've completed the Stepper"})})]});S.args=j;const f=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 (Optional)",actions:{showSkip:!0},children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})})]});m.args=j;c.__docgenInfo={description:"",methods:[],displayName:"Default",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};m.__docgenInfo={description:"",methods:[],displayName:"ConditionalButtons",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};S.__docgenInfo={description:"",methods:[],displayName:"CompletionStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"OptionalStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`(args: StepperProps) => <SimpleStepper {...args}>
    <SimpleStepperStep title="Step 1">
      <div>This is the content for step 1</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 2">
      <div>This is the content for step 2</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 3">
      <div>This is the content for step 3</div>
    </SimpleStepperStep>
  </SimpleStepper>`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
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
}`,...m.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
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
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
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
}`,...f.parameters?.docs?.source}}};const ue=["Default","ConditionalButtons","CompletionStep","OptionalStep"];export{S as CompletionStep,m as ConditionalButtons,c as Default,f as OptionalStep,ue as __namedExportsOrder,le as default};
