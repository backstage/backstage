import{j as o}from"./iframe-CZ56O-V9.js";import{c as e}from"./plugin-D7PDWxiM.js";import{S as l}from"./Grid-DjbHNKXL.js";import{C as m}from"./ComponentAccordion-sWVe9QXW.js";import{w as a}from"./appWrappers-BeJ0xyiP.js";import{T as i}from"./TemplateBackstageLogoIcon-COLcPPzM.js";import{I as s}from"./InfoCard-BF5bOwh8.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DZUy8-Yb.js";import"./componentData-CSZ8ujY9.js";import"./useAnalytics-BS680IS8.js";import"./useApp-BeYLp8SO.js";import"./useRouteRef-CcFxojYp.js";import"./index-Ca3h4iDJ.js";import"./DialogTitle-C-1j8eOs.js";import"./Modal-CQLQBAd-.js";import"./Portal-rgcloK6u.js";import"./Backdrop-DdZZM_yb.js";import"./Button-DKgYvdYh.js";import"./useObservable-ByqNzwSP.js";import"./useIsomorphicLayoutEffect-D3HbnLj9.js";import"./ExpandMore-yvURIOcL.js";import"./AccordionDetails-BaPE-Me3.js";import"./index-B9sM2jn7.js";import"./Collapse-DPNvm9kr.js";import"./useAsync-BZsMG4pg.js";import"./useMountedState-ut5gwY4t.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DTAML6Xx.js";import"./ErrorBoundary-bCgK2ux4.js";import"./ErrorPanel-CQnJnEL8.js";import"./WarningPanel-CChAptH0.js";import"./MarkdownContent-BOJKT2W9.js";import"./CodeSnippet-rkZMP_wC.js";import"./Box-MN-uZs4I.js";import"./styled-D9whByUF.js";import"./CopyTextButton-wUac2sWa.js";import"./useCopyToClipboard-CrTqHNaz.js";import"./Tooltip-B8FLw8lE.js";import"./Popper-7tudyaaz.js";import"./List-DEdaJe5c.js";import"./ListContext-BmrJCIpO.js";import"./ListItem-BtvfynNb.js";import"./ListItemText-Dn38yijY.js";import"./LinkButton-Bp2XTFR0.js";import"./Link-BQF_zimC.js";import"./lodash-Czox7iJy.js";import"./CardHeader-BN2Aoi7y.js";import"./Divider-C407Z4rN.js";import"./CardActions-PhczM4sT.js";import"./BottomLink-B_bxfdsL.js";import"./ArrowForward-CzbSCcaK.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
