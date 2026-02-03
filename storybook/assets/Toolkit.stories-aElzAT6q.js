import{j as o}from"./iframe-BMBKvx7J.js";import{c as e}from"./plugin-Bu2GiY8l.js";import{S as l}from"./Grid-BeDT5Yac.js";import{C as m}from"./ComponentAccordion-UdLvytlC.js";import{w as a}from"./appWrappers-BOJr_U7C.js";import{T as i}from"./TemplateBackstageLogoIcon-Db2JdElv.js";import{I as s}from"./InfoCard-DE1zhvkY.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CijlMu_-.js";import"./componentData-DlTOR1Tf.js";import"./useAnalytics-6fQpVHvB.js";import"./useApp-CHxPlzN3.js";import"./useRouteRef-DhANQE8F.js";import"./index-f5vhF8Nw.js";import"./DialogTitle-DsbJKJA1.js";import"./Modal-CTUzy118.js";import"./Portal-B2w_zRgr.js";import"./Backdrop-B0L6nIyi.js";import"./Button-CgZNjnDR.js";import"./useObservable-B1dXj24X.js";import"./useIsomorphicLayoutEffect-CtcAey4z.js";import"./ExpandMore-sNERVSEz.js";import"./AccordionDetails-jHFZItW8.js";import"./index-B9sM2jn7.js";import"./Collapse-BfJEIrfz.js";import"./useAsync-Hxi-KY7E.js";import"./useMountedState-BBcU3kFA.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BAt-txin.js";import"./ErrorBoundary-BQATzt5e.js";import"./ErrorPanel-D5Anj456.js";import"./WarningPanel-BEJQshL2.js";import"./MarkdownContent-DooLYWBv.js";import"./CodeSnippet-WffvFiX0.js";import"./Box-DyedS4TQ.js";import"./styled-COJRzbtL.js";import"./CopyTextButton-BXHrVG_E.js";import"./useCopyToClipboard-DCvnibP8.js";import"./Tooltip-DXXVKXwk.js";import"./Popper-BvJ_4JLG.js";import"./List-BQBKpXrc.js";import"./ListContext-dtOkQmZD.js";import"./ListItem-CBHuw_mT.js";import"./ListItemText-DxMoHBvJ.js";import"./LinkButton-D0OIQBP6.js";import"./Link-CAECYSd6.js";import"./lodash-Czox7iJy.js";import"./CardHeader-D5ilYYS_.js";import"./Divider-ChrZ6SL1.js";import"./CardActions-3uJylBwn.js";import"./BottomLink-Dme4aBKb.js";import"./ArrowForward-C41XCtXB.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
