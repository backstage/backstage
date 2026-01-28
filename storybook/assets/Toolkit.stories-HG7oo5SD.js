import{j as o}from"./iframe-DFdcbEiJ.js";import{c as e}from"./plugin-DOwt9FZS.js";import{S as l}from"./Grid-Bz80tPVF.js";import{C as m}from"./ComponentAccordion-DbXj8s9e.js";import{w as a}from"./appWrappers-DpruEjTR.js";import{T as i}from"./TemplateBackstageLogoIcon-DlPLnOcM.js";import{I as s}from"./InfoCard-DZsmPUZT.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Bs6oqM75.js";import"./componentData-DKayDtyx.js";import"./useAnalytics-CExwtm2Z.js";import"./useApp--XwcR16b.js";import"./useRouteRef-Ctloo__U.js";import"./index-CJ8jAIcI.js";import"./DialogTitle-D_BPwkq2.js";import"./Modal-CT70aByk.js";import"./Portal-DjeB-iF_.js";import"./Backdrop-B3-TbVKs.js";import"./Button-D7n_65H8.js";import"./useObservable-g2KqN0oS.js";import"./useIsomorphicLayoutEffect-Cf9o0_mJ.js";import"./ExpandMore-CCqXodF2.js";import"./AccordionDetails-DWgDfIG0.js";import"./index-B9sM2jn7.js";import"./Collapse-Bi_tnvhP.js";import"./useAsync-D295T4Y3.js";import"./useMountedState-B2v2il8B.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BUFOZZwh.js";import"./ErrorBoundary-C0Bt02sA.js";import"./ErrorPanel-B3OsaLRR.js";import"./WarningPanel-D07MgOJm.js";import"./MarkdownContent-yQMqdqzq.js";import"./CodeSnippet-BkmLPXrW.js";import"./Box-BjQGvIzi.js";import"./styled-DNdG2dK3.js";import"./CopyTextButton-QsOg2zVP.js";import"./useCopyToClipboard-CoHAd7Ub.js";import"./Tooltip-D0BdWwmK.js";import"./Popper-zn-2LFE5.js";import"./List-C-NEuts9.js";import"./ListContext-D0DH-Ku-.js";import"./ListItem-LVIqWJQW.js";import"./ListItemText-cZEZ1Dk-.js";import"./LinkButton-Tx7Iuxw9.js";import"./Link-Din0jYMc.js";import"./lodash-Czox7iJy.js";import"./CardHeader-BtsllIgw.js";import"./Divider-DmWFkQ65.js";import"./CardActions-Drgr0baR.js";import"./BottomLink-D97LEwZC.js";import"./ArrowForward-CG_5dhQW.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
