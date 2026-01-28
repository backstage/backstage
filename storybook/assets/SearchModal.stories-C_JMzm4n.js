import{j as t,m as u,I as p,b as g,T as h}from"./iframe-Bnzrr9GJ.js";import{r as x}from"./plugin-DQnKwhQR.js";import{S as l,u as c,a as S}from"./useSearchModal-59leOqrQ.js";import{B as m}from"./Button-C4wuUHK5.js";import{a as M,b as C,c as f}from"./DialogTitle-B57sbJyb.js";import{B as j}from"./Box-_ldnD672.js";import{S as n}from"./Grid-yfENroGK.js";import{S as y}from"./SearchType-C9mTXpSZ.js";import{L as I}from"./List-C5zGpaSP.js";import{H as B}from"./DefaultResultListItem-CCLyeQmO.js";import{s as D,M as G}from"./api-ACo5GBlt.js";import{S as R}from"./SearchContext-Ce_u_NY9.js";import{w as T}from"./appWrappers-VyQoo8wK.js";import{SearchBar as k}from"./SearchBar-BK5Ej0uZ.js";import{a as v}from"./SearchResult-C0NqMNru.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DjdzPMHD.js";import"./Plugin-D_YG91mq.js";import"./componentData-q9jR-RmB.js";import"./useAnalytics-0uTDec9U.js";import"./useApp-SixTcc6z.js";import"./useRouteRef-BIDrbivK.js";import"./index-CYC8aWCi.js";import"./ArrowForward-KRJIM6Q4.js";import"./translation-B0CnhoBd.js";import"./Page-C2gBGsO4.js";import"./useMediaQuery-B6shqm4c.js";import"./Divider-Dygs3iK7.js";import"./ArrowBackIos-J6L6a24G.js";import"./ArrowForwardIos-56Ev6FFR.js";import"./translation-CoNlpLBY.js";import"./Modal-C9035a_p.js";import"./Portal-7sPWK5aa.js";import"./Backdrop-U11n_nYY.js";import"./styled-ECwvL4gF.js";import"./ExpandMore-lB9NR-kr.js";import"./useAsync-Cf2YmW8g.js";import"./useMountedState-BCp4s1hj.js";import"./AccordionDetails-CuEuFzda.js";import"./index-B9sM2jn7.js";import"./Collapse-Bk6-UMMi.js";import"./ListItem-WNmrdDGe.js";import"./ListContext-BS9Mebja.js";import"./ListItemIcon-BpTUVwby.js";import"./ListItemText-CaCse6tD.js";import"./Tabs-DPsDfZiY.js";import"./KeyboardArrowRight-DBhyyWwy.js";import"./FormLabel-DZfT6ehy.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-dzhrq95X.js";import"./InputLabel-AL9u2pG0.js";import"./Select-8SA9OREF.js";import"./Popover-Quj_W4ar.js";import"./MenuItem-BEacitvl.js";import"./Checkbox-cAdterB2.js";import"./SwitchBase-DxtHsf8O.js";import"./Chip-CXXD0hwN.js";import"./Link-B2CkVKPO.js";import"./lodash-Czox7iJy.js";import"./useObservable-DuLbtCIZ.js";import"./useIsomorphicLayoutEffect-BBA0B-Gu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BIu3jlRS.js";import"./useDebounce-BO1TbFTS.js";import"./InputAdornment-DqJY-hF-.js";import"./TextField-DIBUfS0U.js";import"./useElementFilter-C-vR8PKJ.js";import"./EmptyState-Di7mUpet.js";import"./Progress-CGF7s-wv.js";import"./LinearProgress-CTS_7g3N.js";import"./ResponseErrorPanel-BBz6sJWC.js";import"./ErrorPanel-CD5X405H.js";import"./WarningPanel-CiGAMcSc.js";import"./MarkdownContent-uyUP_FU2.js";import"./CodeSnippet-CNEmId6n.js";import"./CopyTextButton-h_AlfJlB.js";import"./useCopyToClipboard-C1DHvlyv.js";import"./Tooltip-BNoXxCwH.js";import"./Popper-xM2ICnpy.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
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
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
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
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
