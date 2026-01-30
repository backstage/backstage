import{j as o}from"./iframe-ByNNXeiS.js";import{c as e}from"./plugin-B_nDKzso.js";import{S as l}from"./Grid-COH9vICu.js";import{C as m}from"./ComponentAccordion-CvjAPrVP.js";import{w as a}from"./appWrappers-DatLzHRZ.js";import{T as i}from"./TemplateBackstageLogoIcon-ScvlqJAG.js";import{I as s}from"./InfoCard-Df34tp0q.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-pqbE9k03.js";import"./componentData-CBWBgxbI.js";import"./useAnalytics-BatNLUt2.js";import"./useApp-BIEPQg0g.js";import"./useRouteRef-BhZuTamD.js";import"./index-BTmRWwN6.js";import"./DialogTitle-YYVkYrji.js";import"./Modal-Sjev8ZKO.js";import"./Portal-0sot7Ylp.js";import"./Backdrop-CnaZtlJi.js";import"./Button-DOFZXYjQ.js";import"./useObservable-GGfqox2V.js";import"./useIsomorphicLayoutEffect-BQxAPDGa.js";import"./ExpandMore-BLvu8MU4.js";import"./AccordionDetails-C7U2wsbT.js";import"./index-B9sM2jn7.js";import"./Collapse-BjluhvND.js";import"./useAsync-CQMi4841.js";import"./useMountedState-BOphWm7n.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CsWdY3wg.js";import"./ErrorBoundary-BtTult0-.js";import"./ErrorPanel-CTICeqhn.js";import"./WarningPanel-fBpuhxcO.js";import"./MarkdownContent-Czdavqjx.js";import"./CodeSnippet-DyKHxpoR.js";import"./Box-bD4mu6aM.js";import"./styled-CuXflSyU.js";import"./CopyTextButton-DCj9B9eD.js";import"./useCopyToClipboard-k9NuIUEn.js";import"./Tooltip-Cn9c8OtC.js";import"./Popper-jt-jzf2T.js";import"./List-Dw_wv5bM.js";import"./ListContext-CXkvT0sH.js";import"./ListItem-CKlTPKne.js";import"./ListItemText-DCU7V9rR.js";import"./LinkButton-BZMJ8Uvy.js";import"./Link-B8WLAU68.js";import"./lodash-Czox7iJy.js";import"./CardHeader-Crj5_jlj.js";import"./Divider-DmVn_tUx.js";import"./CardActions-DyrSilUZ.js";import"./BottomLink-DJ3O32BK.js";import"./ArrowForward-CwrmR3h3.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
