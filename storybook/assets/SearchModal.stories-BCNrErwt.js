import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DVMaQ9oH.js";import{r as x}from"./plugin-BOgaFEAy.js";import{S as m,u as n,a as S}from"./useSearchModal-CVqNXQ9R.js";import{B as c}from"./Button-DnJe8T7L.js";import{a as f,b as M,c as j}from"./DialogTitle-BLuVPIsL.js";import{B as C}from"./Box-CFSsj6ua.js";import{S as r}from"./Grid-BnNe0SDT.js";import{S as y}from"./SearchType-BYRRpFNs.js";import{L as I}from"./List-Dti-y3i6.js";import{H as R}from"./DefaultResultListItem-aSTlUKVq.js";import{s as B,M as D}from"./api-DaZsx-8u.js";import{S as T}from"./SearchContext-Cebx7tfZ.js";import{w as k}from"./appWrappers-DDl-WsMM.js";import{SearchBar as v}from"./SearchBar-DWEN6TfS.js";import{a as b}from"./SearchResult-CvZYVAVM.js";import"./preload-helper-PPVm8Dsz.js";import"./index-LZ99HhjX.js";import"./Plugin-CyrjOCVF.js";import"./componentData-CuhNelpK.js";import"./useAnalytics-D_e6aR87.js";import"./useApp-CbdAPFaX.js";import"./useRouteRef-DTds5z5u.js";import"./index-CrsCYslC.js";import"./ArrowForward-D-fiTE2a.js";import"./translation-ChsQuvug.js";import"./Page-Bk3VKmh1.js";import"./useMediaQuery-BBjP_gp4.js";import"./Divider-DFSugnoU.js";import"./ArrowBackIos-BedubF3n.js";import"./ArrowForwardIos-BJ7RhVjm.js";import"./translation-CyF2MSC9.js";import"./Modal-CJ1fn4qg.js";import"./Portal-B9YgpH-D.js";import"./Backdrop-0IChyXw2.js";import"./styled-BBv6xD1v.js";import"./ExpandMore-BkRt0N0x.js";import"./useAsync-C7ceDp4n.js";import"./useMountedState-CB6VIth1.js";import"./AccordionDetails-DDgGuMuh.js";import"./index-B9sM2jn7.js";import"./Collapse-DjiqELor.js";import"./ListItem-D0hmS8se.js";import"./ListContext-BKfPcfO0.js";import"./ListItemIcon-Cmz4If-S.js";import"./ListItemText-1_kgrXU9.js";import"./Tabs-DNgo0naX.js";import"./KeyboardArrowRight-Ct-umqKm.js";import"./FormLabel-BSBgtsp9.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-8YqLOjLb.js";import"./InputLabel-OP04NGxS.js";import"./Select-CkqUWOUP.js";import"./Popover-BAi_Nv0a.js";import"./MenuItem-Bh5YSOIJ.js";import"./Checkbox-CteSubDO.js";import"./SwitchBase-kRjnQcFL.js";import"./Chip-Dc9QAB2j.js";import"./Link-INNWSaUp.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-CxLKaDzP.js";import"./useIsomorphicLayoutEffect-Cs1tA7z9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DuDycR11.js";import"./useDebounce-Dp-sjWDk.js";import"./InputAdornment-BEQ0fKdk.js";import"./TextField-bmLN_dPf.js";import"./useElementFilter-CRLdIB_w.js";import"./EmptyState-CyT7rtRs.js";import"./Progress-fI7jG0Jf.js";import"./LinearProgress-BNuJ28u5.js";import"./ResponseErrorPanel-CVn0rLGo.js";import"./ErrorPanel-DOpGEyf2.js";import"./WarningPanel-C40EW-7C.js";import"./MarkdownContent-DWrveYca.js";import"./CodeSnippet-BT17ih3z.js";import"./CopyTextButton-DhPBCIRt.js";import"./useCopyToClipboard-C3pKoU0U.js";import"./Tooltip-DuScsKtZ.js";import"./Popper-D9ki8Cw9.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
