import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BuVoE93N.js";import{r as x}from"./plugin-Cr3YeEvO.js";import{S as m,u as n,a as S}from"./useSearchModal-T-ZvXRX7.js";import{B as c}from"./Button-DitSkek8.js";import{a as f,b as M,c as j}from"./DialogTitle-BbPlvqCJ.js";import{B as C}from"./Box-EG9f0Y8u.js";import{S as r}from"./Grid-BS_RmjCI.js";import{S as y}from"./SearchType-LjnN6qJT.js";import{L as I}from"./List-p0FQAnkV.js";import{H as R}from"./DefaultResultListItem-D7lbYxHB.js";import{s as B,M as D}from"./api-DsOWsteJ.js";import{S as T}from"./SearchContext-BCG5PVtl.js";import{w as k}from"./appWrappers-Dzyg-wjZ.js";import{SearchBar as v}from"./SearchBar-BNJu1h5f.js";import{a as b}from"./SearchResult-Cf7muQdm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DPjuYX3H.js";import"./Plugin-TD5MgFlM.js";import"./componentData-C8D74Psm.js";import"./useAnalytics-CGq4Uj37.js";import"./useApp-CzP5PYac.js";import"./useRouteRef-D1da1nJw.js";import"./index-CLOs8FQP.js";import"./ArrowForward-DmYv927b.js";import"./translation-DnmRTu-l.js";import"./Page-D-nyfe6o.js";import"./useMediaQuery-_lxiEYiM.js";import"./Divider-Ccs-DDu6.js";import"./ArrowBackIos-Bu6J5gMA.js";import"./ArrowForwardIos-b0k6KVlD.js";import"./translation-WeMyCEAl.js";import"./Modal-DyZkcIsp.js";import"./Portal-C8Go-sfs.js";import"./Backdrop-BgdB2kxh.js";import"./styled-GwDWktgy.js";import"./ExpandMore-DhETGfMT.js";import"./useAsync-Wgi4dREP.js";import"./useMountedState-CTJrFvSG.js";import"./AccordionDetails-hMDXQ06y.js";import"./index-B9sM2jn7.js";import"./Collapse-1RctBr9q.js";import"./ListItem-DWhn9oWM.js";import"./ListContext-ChBBEYBX.js";import"./ListItemIcon-D6OIKSgI.js";import"./ListItemText-BhWjqHFt.js";import"./Tabs-CN1y7-I2.js";import"./KeyboardArrowRight-BF1Wcwli.js";import"./FormLabel-DhWhQW_c.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BJIgSq-Y.js";import"./InputLabel-DaEQzIA4.js";import"./Select-RzLO2HvX.js";import"./Popover-BXpMyGs6.js";import"./MenuItem-BO8r2Ugw.js";import"./Checkbox-Bek1DRBf.js";import"./SwitchBase-CNM0OcZT.js";import"./Chip-B0FXo_z1.js";import"./Link-2efb-DF8.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-C2sfq9NY.js";import"./useIsomorphicLayoutEffect-JJ8yQdtm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CFZEZ_hS.js";import"./useDebounce-BTgIO3SI.js";import"./InputAdornment-BVRhL0Hh.js";import"./TextField-CbjShM1F.js";import"./useElementFilter-B07OWHL7.js";import"./EmptyState-DmBc55QN.js";import"./Progress-CUeAKEGx.js";import"./LinearProgress-BrFBm3VB.js";import"./ResponseErrorPanel-C3ogdqje.js";import"./ErrorPanel-Ds2_o_Gr.js";import"./WarningPanel-Bli1S96p.js";import"./MarkdownContent-Bml6DDvX.js";import"./CodeSnippet-Djqp3Beh.js";import"./CopyTextButton-DpoFWtPj.js";import"./useCopyToClipboard-B1o0Tb_t.js";import"./Tooltip-DeALkc8i.js";import"./Popper-CiIf8Skg.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
