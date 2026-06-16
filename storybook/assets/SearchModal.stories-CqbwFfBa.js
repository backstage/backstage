import{bR as t,u as d,l as u,a5 as h}from"./iframe-Dv_LOz74.js";import{r as g}from"./plugin-BJVoQEzM.js";import{S as m,u as n,b as x}from"./useSearchModal-ByseR3OH.js";import{B as c}from"./Button-oAoRdfUS.js";import{c as S,b as f,a as M}from"./DialogTitle-DELPGoMB.js";import{B as j}from"./Box-CKs0ezee.js";import{S as r}from"./Grid-CVdaifsV.js";import{S as C}from"./SearchType-6rpRVP7Z.js";import{L as y}from"./List-DO7BjG3n.js";import{H as R}from"./DefaultResultListItem-Ctgtcz2d.js";import{O as I}from"./appWrappers-CmEcUByL.js";import{m as B}from"./makeStyles-Balw57Mg.js";import{s as D,M as b}from"./api-B7hXPLBU.js";import{S as k}from"./SearchContext-BPxR63zh.js";import{SearchBar as v}from"./SearchBar-DCQe2YCX.js";import{S as T}from"./SearchResult-lwWWU-CY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B9h7V99y.js";import"./Plugin-D1OvUBMM.js";import"./componentData-BQTeh_4N.js";import"./useAnalytics-BQ1Ntni6.js";import"./useApp-Cy2_bCrQ.js";import"./useRouteRef-1pbbofs0.js";import"./ArrowForward-ChcfiygG.js";import"./translation-DpUWQy8g.js";import"./Page-BKycxKFc.js";import"./useMediaQuery-C6UyU63t.js";import"./Divider-CP9mJEzQ.js";import"./ArrowBackIos-CvmcbTJV.js";import"./ArrowForwardIos-B4yoMeAn.js";import"./translation-DUjIITqD.js";import"./Modal-DrYXJl1m.js";import"./Portal-BH6-A2cn.js";import"./Backdrop-BqG3S90J.js";import"./styled-DwgY9p9o.js";import"./ExpandMore-CiaCt4V2.js";import"./useAsync-CcQw0pT5.js";import"./useMountedState-DpKKYMpO.js";import"./AccordionDetails-CsUP2nBW.js";import"./index-B9sM2jn7.js";import"./Collapse-DktYeogF.js";import"./ListItem-CPDhSI3E.js";import"./ListContext-BQeOYvd4.js";import"./ListItemIcon-DKxbNOdt.js";import"./ListItemText-BOUqpeRS.js";import"./Tabs-Di6UiVuA.js";import"./KeyboardArrowRight-BxvA9piW.js";import"./FormLabel-DfYHs27U.js";import"./formControlState-DT2NLhlt.js";import"./InputLabel-CleVnT9h.js";import"./Select-BkNQv5on.js";import"./Popover-CLwhXdRh.js";import"./MenuItem-etmUB8g8.js";import"./Checkbox-zGWHuSKl.js";import"./SwitchBase-DegrS4Gy.js";import"./Chip-B6vivtmj.js";import"./Link-Dhqn3FRD.js";import"./index-B9AQLwBR.js";import"./lodash-D8r4FPUQ.js";import"./WebStorage-rx70a8xr.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CF22uZMb.js";import"./useIsomorphicLayoutEffect-vDhIERA2.js";import"./BUIProvider-ClTaX_z6.js";import"./openLink-CPEyVxLu.js";import"./useResolvedHref-B4uHO-JA.js";import"./Search-DFNtnT62.js";import"./useDebounce-OjifnC1O.js";import"./InputAdornment-u6R4mcXA.js";import"./TextField-ClYEsy_9.js";import"./useElementFilter-CjGAFsXd.js";import"./EmptyState-DXHI1Mvy.js";import"./Progress-BU5FSTSf.js";import"./LinearProgress-Cv5wPo2E.js";import"./ResponseErrorPanel-j4jEf4x1.js";import"./ErrorPanel-CnSjInV_.js";import"./WarningPanel-BVXmVAtH.js";import"./MarkdownContent-zVZhZPhZ.js";import"./CodeSnippet-Dl7CwFPd.js";import"./CopyTextButton-B8CGcUAq.js";import"./useCopyToClipboard-Dv2aJji5.js";import"./Tooltip-DaQ1ZG1o.js";import"./Popper-BKKCXmHB.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
