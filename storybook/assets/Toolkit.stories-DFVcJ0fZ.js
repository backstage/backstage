import{j as o}from"./iframe-D7hFsAHh.js";import{c as e}from"./plugin-BJCQ9dlH.js";import{S as l}from"./Grid-BBTPNutj.js";import{C as m}from"./ComponentAccordion-qJLWfKbu.js";import{w as a}from"./appWrappers-BPgQm-7I.js";import{T as i}from"./TemplateBackstageLogoIcon-n5h_0Wwr.js";import{I as s}from"./InfoCard-DQx2F9Xz.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BOlTNLJ_.js";import"./componentData-B0-3b838.js";import"./useAnalytics-DEh4mfg6.js";import"./useApp-DH_b7x7P.js";import"./useRouteRef-BuKO7_g7.js";import"./index-CMWiNJrn.js";import"./DialogTitle-I9jy4wXP.js";import"./Modal-DMtGtm-r.js";import"./Portal-8ZiP_Sqy.js";import"./Backdrop-DxPYSkiX.js";import"./Button-Qm72mdor.js";import"./useObservable-CtiHHxxM.js";import"./useIsomorphicLayoutEffect-CtVE3GbE.js";import"./ExpandMore-e5K7_2D4.js";import"./AccordionDetails-Bs_9tEgl.js";import"./index-B9sM2jn7.js";import"./Collapse-CX1fKFyZ.js";import"./useAsync-BELltm9_.js";import"./useMountedState-jyZ6jmpg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CuI1c31y.js";import"./ErrorBoundary-B1MdgVzH.js";import"./ErrorPanel-REZtkXZm.js";import"./WarningPanel-BXBOJrST.js";import"./MarkdownContent-lDWK0lAQ.js";import"./CodeSnippet-DfGrFjGG.js";import"./Box-D-wD6_7y.js";import"./styled-CbYuIyxW.js";import"./CopyTextButton-NjimjsMr.js";import"./useCopyToClipboard-CaZKc_Tm.js";import"./Tooltip-5tHvVIiB.js";import"./Popper-DQ1szM6i.js";import"./List-CIMPRI7k.js";import"./ListContext-D0CqRlfT.js";import"./ListItem-CLTebMeN.js";import"./ListItemText-Ben4oQC7.js";import"./LinkButton-tqpeZKNg.js";import"./Link-JoAHle2P.js";import"./lodash-Czox7iJy.js";import"./CardHeader-Bq5V7SOz.js";import"./Divider-DMcnu_lF.js";import"./CardActions-wVEVY7hR.js";import"./BottomLink-BbJ3fpw-.js";import"./ArrowForward-B95Ii3a7.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
