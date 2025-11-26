import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DXt6I_1q.js";import{r as x}from"./plugin-CfMx6kJs.js";import{S as m,u as n,a as S}from"./useSearchModal-B9y5-a4O.js";import{B as c}from"./Button-Bqv3NR6y.js";import{a as f,b as M,c as j}from"./DialogTitle-DEXlHuyv.js";import{B as C}from"./Box-BQB-mg8-.js";import{S as r}from"./Grid-S6xSP1g4.js";import{S as y}from"./SearchType-B2UquJIh.js";import{L as I}from"./List-PtSETj5l.js";import{H as R}from"./DefaultResultListItem-B-AL52Sq.js";import{s as B,M as D}from"./api-GAYfXGd9.js";import{S as T}from"./SearchContext-BNcIiRVU.js";import{w as k}from"./appWrappers-BbpqoopC.js";import{SearchBar as v}from"./SearchBar-_HaePQuE.js";import{a as b}from"./SearchResult-DgcRnV_A.js";import"./preload-helper-D9Z9MdNV.js";import"./index-gHWkKDiR.js";import"./Plugin-DguzI5U9.js";import"./componentData-ErQLe4OM.js";import"./useAnalytics-CGIT0JTN.js";import"./useApp-Bi1KQAH_.js";import"./useRouteRef-CAgnkOiS.js";import"./index-kCs7zF-O.js";import"./ArrowForward-CdPzQ0qE.js";import"./translation-S0z9MrVh.js";import"./Page-CnAKme8X.js";import"./useMediaQuery-BLlkBj0c.js";import"./Divider-rqAQKIY3.js";import"./ArrowBackIos-DMlSV6xD.js";import"./ArrowForwardIos-bsZ7Pvvn.js";import"./translation-Bi51g5bO.js";import"./Modal-O3HFvYR5.js";import"./Portal-DOTL7Yad.js";import"./Backdrop-PRNJOzON.js";import"./styled-Dla1Uw7W.js";import"./ExpandMore-CSLlRCsy.js";import"./useAsync-uNXDDhwP.js";import"./useMountedState-BEJ2TW9Z.js";import"./AccordionDetails-BnUWlxaJ.js";import"./index-DnL3XN75.js";import"./Collapse-DtNym6qB.js";import"./ListItem-CNHhXRSS.js";import"./ListContext-C4_dHRNu.js";import"./ListItemIcon-BkHLCJmT.js";import"./ListItemText-CaGb_JPi.js";import"./Tabs-BvvoKJzN.js";import"./KeyboardArrowRight-ClZ7Ql0y.js";import"./FormLabel-Df8u9uma.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-33OhtJEr.js";import"./InputLabel-DSc4Qx10.js";import"./Select-D7XYnLRf.js";import"./Popover-B0QqOIFJ.js";import"./MenuItem-CtKi2Sct.js";import"./Checkbox-BVkliRD-.js";import"./SwitchBase-BVxutwRW.js";import"./Chip-Cvf4rAVZ.js";import"./Link-CMkKbcZq.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-DTc_vT-Q.js";import"./useIsomorphicLayoutEffect-l4gsGf2N.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-B8Im-471.js";import"./useDebounce-CFbROmdZ.js";import"./InputAdornment-BJRmjdm2.js";import"./TextField-SJfhDDvQ.js";import"./useElementFilter-5JWb7JDj.js";import"./EmptyState-BSHsCnnF.js";import"./Progress-BtVD4y6Y.js";import"./LinearProgress-DtHPHgMh.js";import"./ResponseErrorPanel-DQTDGjsb.js";import"./ErrorPanel-B33pLPVR.js";import"./WarningPanel-DQn25WOa.js";import"./MarkdownContent-BXxoLhhS.js";import"./CodeSnippet-CItDkStU.js";import"./CopyTextButton-BSjmWnC0.js";import"./useCopyToClipboard-BoyifASt.js";import"./Tooltip-CCBqo9iV.js";import"./Popper-rfLbfelh.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
