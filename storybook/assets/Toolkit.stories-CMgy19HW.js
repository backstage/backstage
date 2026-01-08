import{j as o}from"./iframe-CIdfBUNc.js";import{c as e}from"./plugin-Ce5LEohf.js";import{S as l}from"./Grid-CNMGd53o.js";import{C as m}from"./ComponentAccordion-uKKHnBDD.js";import{w as a}from"./appWrappers-AgrnuiEj.js";import{T as i}from"./TemplateBackstageLogoIcon-CtnTgfDK.js";import{I as s}from"./InfoCard-JJieDDHR.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Cal27Rxh.js";import"./componentData-CJ11DeEU.js";import"./useAnalytics-DK0dZYSI.js";import"./useApp-DNuP2PYf.js";import"./useRouteRef-BtzOE2h6.js";import"./index-6Q4r393t.js";import"./DialogTitle-D9_Z1_7w.js";import"./Modal-BoVNQ_gf.js";import"./Portal-CzMBs-js.js";import"./Backdrop-CX0eMuCq.js";import"./Button-Ckh3f-JS.js";import"./useObservable-DS2HW8Ao.js";import"./useIsomorphicLayoutEffect-BNA5FOYt.js";import"./ExpandMore-CVq5yZzR.js";import"./AccordionDetails-Db8RrwKQ.js";import"./index-B9sM2jn7.js";import"./Collapse-C667vUQ9.js";import"./useAsync-Cop8mLj-.js";import"./useMountedState-CxwBQu50.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DkWk2PaR.js";import"./ErrorBoundary-5twXAJLu.js";import"./ErrorPanel-BxCVrdam.js";import"./WarningPanel-CssXi-zs.js";import"./MarkdownContent-DeGRTh9e.js";import"./CodeSnippet-yQ1UvqA7.js";import"./Box-2FUA-1uv.js";import"./styled-D6NhFGBl.js";import"./CopyTextButton-B2Os4u3r.js";import"./useCopyToClipboard-C5xquscJ.js";import"./Tooltip-CiUyWjSw.js";import"./Popper-zpN6QrBD.js";import"./List-CWTfe060.js";import"./ListContext-BIMkaxMd.js";import"./ListItem-Dfr179My.js";import"./ListItemText-CPW3cjiy.js";import"./LinkButton-DENdbCNl.js";import"./Link-BiOJGlt4.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-CYD6avdX.js";import"./Divider-DSMvF0Rh.js";import"./CardActions-DAFfhJ8c.js";import"./BottomLink-Wb3zLKXo.js";import"./ArrowForward-DWvoUq3l.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
