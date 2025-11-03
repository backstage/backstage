import{j as t,m as d,I as u,b as h,T as g}from"./iframe-D-w6RxGv.js";import{r as x}from"./plugin-DkCkdPDp.js";import{S as m,u as n,a as S}from"./useSearchModal-tDEL21HK.js";import{B as c}from"./Button-BFjkR3wc.js";import{a as f,b as M,c as j}from"./DialogTitle-D3Q4uAmB.js";import{B as C}from"./Box-PhnhPtmh.js";import{S as r}from"./Grid-Dts7GzWa.js";import{S as y}from"./SearchType-Cc7gv9Lp.js";import{L as I}from"./List-CujjVc52.js";import{H as R}from"./DefaultResultListItem-jUnKkWDO.js";import{s as B,M as D}from"./api-bH4IsLhq.js";import{S as T}from"./SearchContext-xhQ06Z36.js";import{w as k}from"./appWrappers-BDndsqAl.js";import{SearchBar as v}from"./SearchBar-DcdbIort.js";import{a as b}from"./SearchResult-BkxbrSxA.js";import"./preload-helper-D9Z9MdNV.js";import"./index-7uD0Pgum.js";import"./Plugin-CWxA29pF.js";import"./componentData-BrNCABFb.js";import"./useAnalytics-DPlXbgxY.js";import"./useApp-CFgLl9KI.js";import"./useRouteRef-DKWFMIlX.js";import"./index-BY4RoNki.js";import"./ArrowForward-D69vUWDI.js";import"./translation-6Zz9rkrh.js";import"./Page-Ujhzfv4x.js";import"./useMediaQuery-Bq-TCgRA.js";import"./Divider-CtO0jY8z.js";import"./ArrowBackIos-BXJkz9CW.js";import"./ArrowForwardIos-CMYYhKqG.js";import"./translation-bfC-l-Js.js";import"./Modal-Ds0hJkbL.js";import"./Portal-DWcyIRvv.js";import"./Backdrop-D0MNdkqU.js";import"./styled-n-xY2yaY.js";import"./ExpandMore-BTmXorSC.js";import"./useAsync-BGWO1dGB.js";import"./useMountedState-CFUXa8RM.js";import"./AccordionDetails-B5XR2THz.js";import"./index-DnL3XN75.js";import"./Collapse-efa4O20L.js";import"./ListItem-DC_Q_Qo-.js";import"./ListContext-yRQd_P0Y.js";import"./ListItemIcon-2J984Gth.js";import"./ListItemText-SKgMyQts.js";import"./Tabs-DdECK1ko.js";import"./KeyboardArrowRight-C0y8_32H.js";import"./FormLabel-BrWJM9yC.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DhGzy3_m.js";import"./InputLabel-B_AnQ5Zi.js";import"./Select-5w4N0jKM.js";import"./Popover-DFIQSwlD.js";import"./MenuItem-BJBqXcYr.js";import"./Checkbox-CU4-4Stb.js";import"./SwitchBase-DYKa4YGj.js";import"./Chip-Wi8m1HIe.js";import"./Link-Dhe_VRcU.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-CKEb6xrB.js";import"./useIsomorphicLayoutEffect-BdbRXj_e.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-DqURSzIA.js";import"./useDebounce-B-3KmYR0.js";import"./InputAdornment-C-A1JwGH.js";import"./TextField-CBbSa-wt.js";import"./useElementFilter-C_2RenGl.js";import"./EmptyState-C4199y7d.js";import"./Progress-yvjmVcSM.js";import"./LinearProgress-BPxQlr3u.js";import"./ResponseErrorPanel-D_yJqG4d.js";import"./ErrorPanel-BqOBprFq.js";import"./WarningPanel-8DIVHb20.js";import"./MarkdownContent---Ocrjn1.js";import"./CodeSnippet-CVxT4o4G.js";import"./CopyTextButton-CDPhBR-t.js";import"./useCopyToClipboard-D_vXHP6Q.js";import"./Tooltip-D4tR_jXC.js";import"./Popper-Dx-ZWhUD.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
