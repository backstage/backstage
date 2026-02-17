import{j as e,r as d,W as N}from"./iframe-B5eUq3Se.js";import{S as k,L as z}from"./Label-CszljwOo.js";import{s as B,M as W}from"./api-B14kPR2y.js";import{S as T,u as q}from"./SearchContext-Cz_O2Ud4.js";import{m as E}from"./makeStyles-CutSd0r9.js";import{SearchBar as H}from"./SearchBar-D0Cv3GiU.js";import{A as M}from"./Autocomplete-CSTA26sR.js";import{C as V}from"./CircularProgress-BuJwfxhk.js";import{S as P}from"./Grid-BE58qVmP.js";import{w as G}from"./appWrappers-D_vYNmvE.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-_8ZbDfZV.js";import"./ListContext-BhsEYfmX.js";import"./ListItemText-WVljPJU4.js";import"./lodash-D0fT-qTZ.js";import"./useAsync-DSFOvIAI.js";import"./useMountedState-ByxWK81W.js";import"./useAnalytics-Bf6-Pwlo.js";import"./Search-BDehEYi3.js";import"./useDebounce-Bn7JMTxl.js";import"./translation-DKDegIeL.js";import"./InputAdornment-Cs6EJLF-.js";import"./useFormControl-CYFO1Jpf.js";import"./Button-Ch2ew7F2.js";import"./TextField-Bm6cHHZK.js";import"./Select-Bp0k1kVp.js";import"./index-B9sM2jn7.js";import"./Popover-Bud6loLp.js";import"./Modal-BjTDIRku.js";import"./Portal-DpJbamzY.js";import"./List-Cr_JFt2Y.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel--ORxnC5j.js";import"./InputLabel-BKzBWkWH.js";import"./useApp-D6Xkw0OG.js";import"./Chip-BdTMGwlk.js";import"./Popper-DZlzY0sF.js";import"./ListSubheader-XYTC-Ww_.js";import"./useObservable-CyX3WU3z.js";import"./useIsomorphicLayoutEffect-gcdEgIho.js";import"./componentData-CPUvoYik.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Cz1Ci6GP.js";const F=E(t=>({loading:{right:t.spacing(1),position:"absolute"}})),J=t=>c=>e.jsx(T,{inheritParentContextIfAvailable:!0,children:e.jsx(t,{...c})}),K=()=>{const t=F();return e.jsx(V,{className:t.loading,"data-testid":"search-autocomplete-progressbar",color:"inherit",size:20})},p=J(function(c){const{loading:x,value:u,onChange:S=()=>{},options:w=[],getOptionLabel:h=o=>String(o),inputPlaceholder:g,inputDebounceTime:A,freeSolo:b=!0,fullWidth:j=!0,clearOnBlur:C=!1,"data-testid":_="search-autocomplete",...L}=c,{setTerm:y}=q(),l=d.useCallback(o=>o?typeof o=="string"?o:h(o):"",[h]),I=d.useMemo(()=>l(u),[u,l]),R=d.useCallback((o,m,f,O)=>{y(l(m)),S(o,m,f,O)},[l,y,S]),v=d.useCallback(({InputProps:{ref:o,className:m,endAdornment:f},InputLabelProps:O,...D})=>e.jsx(H,{...D,ref:o,clearButton:!1,value:I,placeholder:g,debounceTime:A,endAdornment:x?e.jsx(K,{}):f,InputProps:{className:m}}),[x,I,g,A]);return e.jsx(M,{...L,"data-testid":_,value:u,onChange:R,options:w,getOptionLabel:h,renderInput:v,freeSolo:b,fullWidth:j,clearOnBlur:C})});p.__docgenInfo={description:`Recommended search autocomplete when you use the Search Provider or Search Context.

@public`,methods:[],displayName:"SearchAutocomplete",props:{"data-testid":{required:!1,tsType:{name:"string"},description:""},inputPlaceholder:{required:!1,tsType:{name:"Partial['placeholder']",raw:"SearchBarProps['placeholder']"},description:""},inputDebounceTime:{required:!1,tsType:{name:"Partial['debounceTime']",raw:"SearchBarProps['debounceTime']"},description:""}}};const qe={title:"Plugins/Search/SearchAutocomplete",component:p,decorators:[t=>G(e.jsx(N,{apis:[[B,new W]],children:e.jsx(T,{children:e.jsx(P,{container:!0,direction:"row",children:e.jsx(P,{item:!0,xs:12,children:e.jsx(t,{})})})})}))],tags:["!manifest"]},r=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),s=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),n=()=>{const t=["hello-word","petstore","spotify"];return e.jsx(p,{options:t,value:t[0]})},i=()=>e.jsx(p,{options:[],loading:!0}),a=()=>{const t=[{title:"hello-world",text:"Hello World example for gRPC"},{title:"petstore",text:"The petstore API"},{title:"spotify",text:"The Spotify web API"}];return e.jsx(p,{options:t,renderOption:c=>e.jsx(k,{icon:e.jsx(z,{titleAccess:"Option icon"}),primaryText:c.title,secondaryText:c.text})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Outlined"};n.__docgenInfo={description:"",methods:[],displayName:"Initialized"};i.__docgenInfo={description:"",methods:[],displayName:"LoadingOptions"};a.__docgenInfo={description:"",methods:[],displayName:"RenderingCustomOptions"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Outlined = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Initialized = () => {
  const options = ["hello-word", "petstore", "spotify"];
  return <SearchAutocomplete options={options} value={options[0]} />;
};
`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const LoadingOptions = () => {
  return <SearchAutocomplete options={[]} loading />;
};
`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const RenderingCustomOptions = () => {
  const options = [
    {
      title: "hello-world",
      text: "Hello World example for gRPC",
    },
    {
      title: "petstore",
      text: "The petstore API",
    },
    {
      title: "spotify",
      text: "The Spotify web API",
    },
  ];

  return (
    <SearchAutocomplete
      options={options}
      renderOption={(option) => (
        <SearchAutocompleteDefaultOption
          icon={<LabelIcon titleAccess="Option icon" />}
          primaryText={option.title}
          secondaryText={option.text}
        />
      )}
    />
  );
};
`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const options = ['hello-word', 'petstore', 'spotify'];
  return <SearchAutocomplete options={options} value={options[0]} />;
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={[]} loading />;
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const options = [{
    title: 'hello-world',
    text: 'Hello World example for gRPC'
  }, {
    title: 'petstore',
    text: 'The petstore API'
  }, {
    title: 'spotify',
    text: 'The Spotify web API'
  }];
  return <SearchAutocomplete options={options} renderOption={option => <SearchAutocompleteDefaultOption icon={<LabelIcon titleAccess="Option icon" />} primaryText={option.title} secondaryText={option.text} />} />;
}`,...a.parameters?.docs?.source}}};const Ee=["Default","Outlined","Initialized","LoadingOptions","RenderingCustomOptions"];export{r as Default,n as Initialized,i as LoadingOptions,s as Outlined,a as RenderingCustomOptions,Ee as __namedExportsOrder,qe as default};
