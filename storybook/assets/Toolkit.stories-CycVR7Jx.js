import{j as o}from"./iframe-DfW0k9e4.js";import{c as e}from"./plugin-C2W4X8kV.js";import{S as l}from"./Grid-DOkM8E58.js";import{C as m}from"./ComponentAccordion-4_fQzMBF.js";import{w as a}from"./appWrappers-Bey6bAOs.js";import{T as i}from"./TemplateBackstageLogoIcon-C47fXrX8.js";import{I as s}from"./InfoCard-AOVHQz_Y.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CujPLxPN.js";import"./componentData-AJopfss2.js";import"./useAnalytics-BnjriHJi.js";import"./useApp-BXmyl95T.js";import"./useRouteRef-CckqiBtY.js";import"./index-Gw3tDiAb.js";import"./DialogTitle-CE2AHhUw.js";import"./Modal-B6gsZuYb.js";import"./Portal-D7dEWwg8.js";import"./Backdrop-BGOjf9vo.js";import"./Button-Fr0OfS-w.js";import"./useObservable-DVRVcpuV.js";import"./useIsomorphicLayoutEffect--dLzM9RT.js";import"./ExpandMore-DgZ6UNBD.js";import"./AccordionDetails-B314eioH.js";import"./index-B9sM2jn7.js";import"./Collapse-kvPWdbht.js";import"./useAsync-CE87cvV8.js";import"./useMountedState-qW-VDUVJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-C_v1HCxv.js";import"./ErrorBoundary-QuxMpnIx.js";import"./ErrorPanel-BMIN-fu2.js";import"./WarningPanel-BP-y6z0y.js";import"./MarkdownContent-DX3OAbaQ.js";import"./CodeSnippet--VZdTbP8.js";import"./Box-D0zAdjf6.js";import"./styled-CReYHJ7K.js";import"./CopyTextButton-BDBeSRds.js";import"./useCopyToClipboard-DOwrP97-.js";import"./Tooltip-DzakseTW.js";import"./Popper-B4DyDbOp.js";import"./List-B3BEM4nz.js";import"./ListContext-hwCl85Z0.js";import"./ListItem-Bw1vw_JI.js";import"./ListItemText-IHJkJ5se.js";import"./LinkButton-BvSq_KJp.js";import"./Link-BloAuSmB.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-BEXtfers.js";import"./Divider-CYGCiMiq.js";import"./CardActions-D-jrTd0z.js";import"./BottomLink-DRktrqa9.js";import"./ArrowForward-Cz23y3ha.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
