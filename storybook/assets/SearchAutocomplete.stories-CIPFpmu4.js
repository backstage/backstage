import{j as e,m as N,r as d,T as k}from"./iframe-D7tLk4ld.js";import{S as z,L as B}from"./Label-CdRYgd93.js";import{s as W,M as q}from"./api-BUdgNFzo.js";import{S as P,u as E}from"./SearchContext-D-ImOu9Y.js";import{SearchBar as H}from"./SearchBar-1Q3jrZeD.js";import{A as M}from"./Autocomplete-BofIElEJ.js";import{C as V}from"./CircularProgress-BO0benBW.js";import{S as O}from"./Grid-DIKn7D0E.js";import{w as G}from"./appWrappers-LFN562Aq.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-0fesE0Jk.js";import"./ListContext-2_-4hUG0.js";import"./ListItemText-DUrf7V-S.js";import"./lodash-Czox7iJy.js";import"./useAsync-PQB885ej.js";import"./useMountedState-CdD92umV.js";import"./useAnalytics-CQ9fO8VZ.js";import"./Search-CLKdfu0c.js";import"./useDebounce-DnBeiz4H.js";import"./translation-8TzQ5zoO.js";import"./InputAdornment-DZ-9Oytc.js";import"./useFormControl-bXlwkDCf.js";import"./Button-z5kV09UR.js";import"./TextField-B0GEB87Y.js";import"./Select-DyhOzteH.js";import"./index-B9sM2jn7.js";import"./Popover-9B-RCRNY.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./List-By8TLyAJ.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-C6eEetQj.js";import"./InputLabel-B-pXPnI8.js";import"./useApp-D_E3IHJo.js";import"./Chip-VEOz4QTW.js";import"./Popper-B109mB6A.js";import"./ListSubheader-CvjBZf6p.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./componentData-Dqkdwtuq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-aaT1AT_u.js";const F=N(t=>({loading:{right:t.spacing(1),position:"absolute"}})),J=t=>c=>e.jsx(P,{inheritParentContextIfAvailable:!0,children:e.jsx(t,{...c})}),K=()=>{const t=F();return e.jsx(V,{className:t.loading,"data-testid":"search-autocomplete-progressbar",color:"inherit",size:20})},p=J(function(c){const{loading:x,value:u,onChange:S=()=>{},options:w=[],getOptionLabel:h=o=>String(o),inputPlaceholder:g,inputDebounceTime:A,freeSolo:b=!0,fullWidth:j=!0,clearOnBlur:C=!1,"data-testid":_="search-autocomplete",...L}=c,{setTerm:y}=E(),l=d.useCallback(o=>o?typeof o=="string"?o:h(o):"",[h]),I=d.useMemo(()=>l(u),[u,l]),R=d.useCallback((o,m,f,T)=>{y(l(m)),S(o,m,f,T)},[l,y,S]),v=d.useCallback(({InputProps:{ref:o,className:m,endAdornment:f},InputLabelProps:T,...D})=>e.jsx(H,{...D,ref:o,clearButton:!1,value:I,placeholder:g,debounceTime:A,endAdornment:x?e.jsx(K,{}):f,InputProps:{className:m}}),[x,I,g,A]);return e.jsx(M,{...L,"data-testid":_,value:u,onChange:R,options:w,getOptionLabel:h,renderInput:v,freeSolo:b,fullWidth:j,clearOnBlur:C})});p.__docgenInfo={description:`Recommended search autocomplete when you use the Search Provider or Search Context.

@public`,methods:[],displayName:"SearchAutocomplete",props:{"data-testid":{required:!1,tsType:{name:"string"},description:""},inputPlaceholder:{required:!1,tsType:{name:"Partial['placeholder']",raw:"SearchBarProps['placeholder']"},description:""},inputDebounceTime:{required:!1,tsType:{name:"Partial['debounceTime']",raw:"SearchBarProps['debounceTime']"},description:""}}};const We={title:"Plugins/Search/SearchAutocomplete",component:p,decorators:[t=>G(e.jsx(k,{apis:[[W,new q]],children:e.jsx(P,{children:e.jsx(O,{container:!0,direction:"row",children:e.jsx(O,{item:!0,xs:12,children:e.jsx(t,{})})})})}))],tags:["!manifest"]},r=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),s=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),n=()=>{const t=["hello-word","petstore","spotify"];return e.jsx(p,{options:t,value:t[0]})},a=()=>e.jsx(p,{options:[],loading:!0}),i=()=>{const t=[{title:"hello-world",text:"Hello World example for gRPC"},{title:"petstore",text:"The petstore API"},{title:"spotify",text:"The Spotify web API"}];return e.jsx(p,{options:t,renderOption:c=>e.jsx(z,{icon:e.jsx(B,{titleAccess:"Option icon"}),primaryText:c.title,secondaryText:c.text})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Outlined"};n.__docgenInfo={description:"",methods:[],displayName:"Initialized"};a.__docgenInfo={description:"",methods:[],displayName:"LoadingOptions"};i.__docgenInfo={description:"",methods:[],displayName:"RenderingCustomOptions"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Outlined = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Initialized = () => {
  const options = ["hello-word", "petstore", "spotify"];
  return <SearchAutocomplete options={options} value={options[0]} />;
};
`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const LoadingOptions = () => {
  return <SearchAutocomplete options={[]} loading />;
};
`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const RenderingCustomOptions = () => {
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
`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const options = ['hello-word', 'petstore', 'spotify'];
  return <SearchAutocomplete options={options} value={options[0]} />;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={[]} loading />;
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const qe=["Default","Outlined","Initialized","LoadingOptions","RenderingCustomOptions"];export{r as Default,n as Initialized,a as LoadingOptions,s as Outlined,i as RenderingCustomOptions,qe as __namedExportsOrder,We as default};
